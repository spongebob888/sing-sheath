export const HYSTERIA2_OUTBOUND_TEMPLATE = {
	tag: 'hysteria2-out',
	type: 'hysteria2',
	server: 'EXAMPLE.COM',
	server_port: 443,
	obfs: {
		type: '',
		password: ''
	},
	password: 'PASSWORD',
	up_mbps: 100,
	down_mbps: 150,
	tls: {
		enabled: true,
		ech: {
			enabled: false
		}
	}
};
