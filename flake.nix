{
  inputs = {
    nixpkgs.url = "nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        libraries = with pkgs;[
          webkitgtk
          gtk3
          cairo
          gdk-pixbuf
          glib
          dbus
          openssl_3
          libayatana-appindicator
        ];

        packages = with pkgs; [
          curl
          wget
          pkg-config
          dbus
          openssl_3
          glib
          gtk3
          libsoup
          webkitgtk
          nodejs_latest
          libayatana-appindicator
          rustup
        ];
      in
      {
        devShell = pkgs.mkShell {
          buildInputs = packages;

          shellHook =
            ''
              export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath libraries}:$LD_LIBRARY_PATH
            '';
        };
      });
}
