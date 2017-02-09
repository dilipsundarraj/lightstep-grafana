# LightStep Grafana plug-in

## Installation

To install the plugin, copy the contents of the git repository to your plugin directory. The default on Linux systems is `/var/lib/grafana/plugins`.

Note that Grafana 4 or newer is required.

## Usage

In order for Grafana to be able to use the plugin, the browser must be logged in to LightStep. The only two parameters required are the project name and operation ID.

The json for the panel looks like
```json
{
  "type": "lightstep-panel",
  "operationID": "OPERATION_ID",
  "project": "PROJECT_NAME"
}
```
