# LightStep Grafana plug-in

## Installation

Grafana 4 or newer is required for use the plug-in.

To install the plug-in, copy the contents of the git repository to your plugin directory. The default on Linux systems is `/var/lib/grafana/plugins`.  Depending on your setup, you may need to restart your Grafana instance after the plug-in is installed.

## Usage

In order for the embedded graphs to display, your browser must be logged into LightStep. 

The two parameters required are the project name and the ID of the operation or saved search.

The json for the panel looks like:

```json
{
  "type": "lightstep-panel",
  "operationID": "OPERATION_ID",
  "project": "PROJECT_NAME"
}
```
