import fs from 'fs-extra';
import tar from 'tar';
import zlib from 'zlib';
import path from 'path';
import AdmZip from 'adm-zip';
import fetch from 'node-fetch';
import proxyAgent from 'https-proxy-agent';
import { execSync } from 'child_process';

const cwd = process.cwd();
const TEMP_DIR = path.join(cwd, 'node_modules/.temp');
const FORCE = process.argv.includes('--force');

const SIDECAR_HOST = execSync('rustc -vV')
	.toString()
	.match(/(?<=host: ).+(?=\s*)/g)[0];

/* ======= clash ======= */
const SING_BOX_URL_PREFIX = 'https://github.com/SagerNet/sing-box/releases/download/';
const SING_BOX_VERSION = '1.2.7';

const SING_BOX_MAP = {
	'win32-x64': `sing-box-${SING_BOX_VERSION}-windows-amd64`,
	'darwin-x64': `sing-box-${SING_BOX_VERSION}-darwin-amd64`,
	'darwin-arm64': `sing-box-${SING_BOX_VERSION}-darwin-arm64`,
	'linux-x64': `sing-box-${SING_BOX_VERSION}-linux-amd64`,
	'linux-arm64': `sing-box-${SING_BOX_VERSION}-linux-arm64`
};

/**
 * check available
 */

const { platform, arch } = process;
if (!SING_BOX_MAP[`${platform}-${arch}`]) {
	throw new Error(`sing-box unsupported platform "${platform}-${arch}"`);
}

function sing_box() {
	const name = SING_BOX_MAP[`${platform}-${arch}`];

	const isWin = platform === 'win32';
	const urlExt = isWin ? 'zip' : 'tar.gz';
	const downloadURL = `${SING_BOX_URL_PREFIX}/v${SING_BOX_VERSION}/${name}.${urlExt}`;
	const exeFile = `sing-box${isWin ? '.exe' : ''}`;
	const zipFile = `${name}.${urlExt}`;

	return {
		name: name,
		targetFile: `sing-box-${SIDECAR_HOST}${isWin ? '.exe' : ''}`,
		exeFile,
		zipFile,
		downloadURL
	};
}

/**
 * download sidecar and rename
 */
async function resolveSidecar(binInfo) {
	const { name, targetFile, zipFile, exeFile, downloadURL } = binInfo;

	const sidecarDir = path.join(cwd, 'sing-sword', 'resources', 'core');
	const sidecarPath = path.join(sidecarDir, targetFile);

	await fs.mkdirp(sidecarDir);
	if (!FORCE && (await fs.pathExists(sidecarPath))) return;

	const tempDir = path.join(TEMP_DIR, name);
	const tempZip = path.join(tempDir, zipFile);
	const tempExe = path.join(tempDir, exeFile);

	await fs.mkdirp(tempDir);
	if (!(await fs.pathExists(tempZip))) await downloadFile(downloadURL, tempZip);

	if (zipFile.endsWith('.zip')) {
		const zip = new AdmZip(tempZip);
		zip.getEntries().forEach((entry) => {
			console.log(`[DEBUG]: ${name} entry name`, entry.entryName);
		});
		zip.extractAllTo(TEMP_DIR, true);
		await fs.rename(tempExe, sidecarPath);
		console.log(`[INFO]: ${name} unzip finished`);
	} else {
		tar.extract({
			file: tempZip,
			cwd: TEMP_DIR,
			sync: true
		   });
		console.log("Extraction completed successfully.");
		await fs.rename(tempExe, sidecarPath);
	}

	// delete temp dir
	await fs.remove(tempDir);
}

/**
 * download the file to the resources dir
 */
async function resolveResource(binInfo) {
	const { file, downloadURL } = binInfo;

	const resDir = path.join(cwd, 'src-tauri/resources');
	const targetPath = path.join(resDir, file);

	if (!FORCE && (await fs.pathExists(targetPath))) return;

	await fs.mkdirp(resDir);
	await downloadFile(downloadURL, targetPath);

	console.log(`[INFO]: ${file} finished`);
}

/**
 * download file and save to `path`
 */
async function downloadFile(url, path) {
	const options = {};

	const httpProxy =
		process.env.HTTP_PROXY ||
		process.env.http_proxy ||
		process.env.HTTPS_PROXY ||
		process.env.https_proxy;

	if (httpProxy) {
		options.agent = proxyAgent(httpProxy);
	}

	const response = await fetch(url, {
		...options,
		method: 'GET',
		headers: { 'Content-Type': 'application/octet-stream' }
	});
	const buffer = await response.arrayBuffer();
	await fs.writeFile(path, new Uint8Array(buffer));

	console.log(`[INFO]: download finished "${url}"`);
}

const tasks = [{ name: 'sing_box', func: () => resolveSidecar(sing_box()), retry: 5 }];

async function runTask() {
	const task = tasks.shift();
	if (!task) return;
	if (task.winOnly && process.platform !== 'win32') return runTask();

	for (let i = 0; i < task.retry; i++) {
		try {
			await task.func();
			break;
		} catch (err) {
			console.error(`[ERROR]: task::${task.name} try ${i} == `, err.message);
		}
	}
	return runTask();
}

runTask();
runTask();
