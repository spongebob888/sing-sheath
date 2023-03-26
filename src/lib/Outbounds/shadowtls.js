export const SHADOWTLS_OUTBOUND_TEMPLATE = {
	tag: 'shadowtls-out',
	type: 'shadowtls',
	version: 2,
	server: 'EXAMPLE.COM',
	server_port: 8443,
	tls: {
		enabled: true,
		server_name: 'microsoft.com'
	}
};
