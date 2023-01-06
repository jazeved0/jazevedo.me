#!/usr/bin/env bash
# Template from https://betterdev.blog/minimal-safe-bash-script-template/

set -Eeuo pipefail
script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd -P)
project_root="$script_dir"/../..

msg() {
  echo >&2 -e "${1-}"
}

msg "Building risk-game embed"
(cd "$script_dir"/vue-embed && npm run build)
msg "Clearing demo folder"
rm -rf "$project_root"/demo
mkdir "$project_root"/demo
msg "Copying files"
cp -r "$script_dir"/vue-embed/dist/* "$project_root"/demo/
msg "Done"
