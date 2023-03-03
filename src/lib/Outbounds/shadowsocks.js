export const SHADOWSOCKS_OUTBOUND_TEMPLATE = 
{
    tag: "ss-out",
    type: "shadowsocks",

    server: "EXAMPLE.COM",
    server_port: 1080,
    method: "2022-blake3-aes-128-gcm",
    password: "BASE64 PASSWORD",
    multiplex: {
      enabled: true,
      max_connections: 4,
      min_streams: 4
    }
  };
