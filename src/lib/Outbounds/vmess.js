export const VMESS_OUTBOUND_TEMPLATE = {
	tag: 'vmess-out',
	type: 'vmess',
	server: 'EXAMPLE.COM',
	server_port: 443,
	uuid: 'UUID',
	alter_id: 0,
	security: 'auto',
	tls: {
		enabled: true,
		disable_sni: false,
		server_name: 'EXAMPLE.COM',
		insecure: false
	},
	transport: {
		type: 'ws',
		path: '/path'
	},
	multiplex: {
		enabled: true,
		protocol: 'smux',
		max_connections: 4,
		min_streams: 4,
		max_streams: 0
	}
};
