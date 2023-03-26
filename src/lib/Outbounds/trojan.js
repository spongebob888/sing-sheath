export const TROJAN_OUTBOUND_TEMPLATE = {
	tag: 'trojan-out',
	type: 'trojan',
	server: 'EXAMPLE.COM',
	server_port: 443,

	password: 'PASSWORD',
	tls: {
		enabled: true,
		disable_sni: false,
		server_name: 'EXAMPLE.COM',
		insecure: false,
		alpn: ['h2', 'http/1.1']
	},
	multiplex: {
		enabled: true,
		max_connections: 4,
		min_streams: 4
	}
};
