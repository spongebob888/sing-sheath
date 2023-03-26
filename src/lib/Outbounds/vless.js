export const VLESS_OUTBOUND_TEMPLATE = {
	tag: 'vless-out',
	type: 'vless',

	server: 'EXAMPLE.COM',
	server_port: 443,
	uuid: 'UUID',
	flow: 'xtls-rprx-vision',
	tls: {
		enabled: true,
		disable_sni: false,
		server_name: 'EXAMPLE.COM',
		insecure: false
	},
	packet_encoding: '',
	transport: {
		type: 'tls'
	}
};
