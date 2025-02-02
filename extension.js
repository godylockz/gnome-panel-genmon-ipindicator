import Clutter from "gi://Clutter";
import Gio from "gi://Gio";
import GLib from "gi://GLib";
import GObject from "gi://GObject";
import St from "gi://St";
import * as PanelMenu from "resource:///org/gnome/shell/ui/panelMenu.js";
import { panel } from "resource:///org/gnome/shell/ui/main.js";
import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";

const DEBUG_LOG = false;
const IP_REFRESH_TIME = 5; // seconds
const DEFAULT_NETWORK_INTERFACES = ["tun1", "tun0", "wg0", "eth0", "eth1"];

function debugLog(message) {
  if (DEBUG_LOG) {
    console.log(message);
  }
}

Gio._promisify(Gio.Subprocess.prototype, "communicate_utf8_async");

export const getIP = async () => {
  const ipCommand = [
    "/bin/sh",
    "-c",
    `for int in ${DEFAULT_NETWORK_INTERFACES.join(
      " "
    )}; do ip=$(ip -o -4 addr show "$int" 2>/dev/null | awk '{print $4}' | cut -d/ -f1); [ -n "$ip" ] && echo -n "$ip" && break; done`,
  ];

  const ipProc = new Gio.Subprocess({
    argv: ipCommand,
    flags: Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE,
  });

  ipProc.init(null);
  const [stdout] = await ipProc.communicate_utf8_async(null, null);
  return stdout.trim();
};

export const IpIndicator = GObject.registerClass(
  {
    GTypeName: "IpIndicator",
  },
  class IpIndicator extends PanelMenu.Button {
    _init() {
      super._init(0, "IP Indicator", false);

      this.box = new St.BoxLayout({
        vertical: false,
        style: "padding-left: 5px; padding-right: 5px;",
      });

      this.defaultIcon = new St.Icon({
        icon_name: "network-wired",
        icon_size: 16,
        style_class: "system-status-icon",
      });

      this.vpnIcon = new St.Icon({
        icon_name: "network-vpn",
        icon_size: 16,
        style_class: "system-status-icon",
      });

      this.buttonText = new St.Label({
        text: "No IP",
        y_align: Clutter.ActorAlign.CENTER,
        style: "padding-left: 5px; color: white;",
      });

      this.box.add_child(this.defaultIcon);
      this.add_child(this.box);

      debugLog("IpIndicator initialized.");
      this._updateLabel();
    }

    _updateLabel() {
      if (this._timeout) {
        GLib.source_remove(this._timeout);
        this._timeout = undefined;
      }

      this._timeout = GLib.timeout_add_seconds(0, IP_REFRESH_TIME, async () => {
        try {
          const ip = await getIP();
          debugLog(`IP: ${ip}`);

          if (ip) {
            this.buttonText.set_text(ip);

            if (this.box.contains(this.defaultIcon)) {
              this.box.remove_child(this.defaultIcon);
            }
            if (!this.box.contains(this.vpnIcon)) {
              this.box.add_child(this.vpnIcon);
            }
            if (!this.box.contains(this.buttonText)) {
              this.box.add_child(this.buttonText);
            }

            this.connect("button-press-event", () => {
              St.Clipboard.get_default().set_text(
                St.ClipboardType.CLIPBOARD,
                ip
              );
              debugLog(`Copied IP to clipboard: ${ip}`);
            });
          } else {
            if (this.box.contains(this.buttonText)) {
              this.box.remove_child(this.buttonText);
            }
            if (this.box.contains(this.vpnIcon)) {
              this.box.remove_child(this.vpnIcon);
            }
            if (!this.box.contains(this.defaultIcon)) {
              this.box.add_child(this.defaultIcon);
            }
          }
        } catch (error) {
          debugLog(`Error updating IP: ${error.message}`);
        }

        return GLib.SOURCE_CONTINUE;
      });
    }

    destroy() {
      if (this._timeout) {
        GLib.source_remove(this._timeout);
      }
      this._timeout = undefined;
      this.menu.removeAll();
      debugLog("IpIndicator stopped.");
      super.destroy();
    }
  }
);

export default class IPIndicatorExtension extends Extension {
  constructor(metadata) {
    super(metadata);
    // DO NOT create objects, connect signals or add main loop sources here
  }

  enable() {
    this._indicator = new IpIndicator();
    panel.addToStatusArea("ipindicator", this._indicator);
  }

  disable() {
    if (this._indicator) {
      this._indicator.destroy();
      this._indicator = undefined;
    }
  }
}
