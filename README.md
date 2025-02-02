# Gnome IP Indicator

**Gnome IP Indicator** is a GNOME Shell extension that displays the IP address in the top bar, prioritizing your VPN IP address if connected. The IP address is clickable, allowing you to easily copy it to the clipboard.

## Features

- Displays the current IP address in the GNOME Shell top panel.
- Prioritizes VPN IP if connected.
- Click the IP address to copy it to your clipboard for easy sharing or use.

## Installation

### Requirements

- GNOME Shell version 47 or higher.
- `glib-compile-schemas` (to compile the schemas).

### Steps

1. **Clone the repository:**
   Clone the extension into your local GNOME Shell extensions directory:

   ```bash
   git clone https://github.com/godylockz/gnome-panel-genmon-ipindicator.git ~/.local/share/gnome-shell/extensions/top-panel-genmon-ipindicator@godylockz
   ```

2. **Compile schemas:**
   Navigate to the extension directory and compile the schemas:

   ```bash
   cd ~/.local/share/gnome-shell/extensions/top-panel-genmon-ipindicator@godylockz
   glib-compile-schemas schemas/
   ```

3. **Enable the extension:**
   After compiling the schemas, you need to reload GNOME Shell and enable the extension.

   - Press `Alt + F2`, type `r`, and press Enter to reload GNOME Shell.
   - Enable the extension:

     ```bash
     gnome-extensions enable top-panel-genmon-ipindicator@godylockz
     ```

4. **Disable the extension (if needed):**
   If you ever need to disable the extension:

   ```bash
   gnome-extensions disable top-panel-genmon-ipindicator@godylockz
   ```

### Settings

You can adjust the extension's settings using the GNOME Tweaks tool or `gnome-extensions` command-line tool. The settings are stored under the schema `org.gnome.shell.extensions.ipindicator`.

## Contributing

Feel free to fork the repository and submit pull requests for any improvements, bug fixes, or new features.

## License

This extension is open-source and licensed under the MIT License.

## Issues

For bug reports or feature requests, please open an issue in the [GitHub repository](https://github.com/godylockz/gnome-panel-genmon-ipindicator).
