# HomeBrew Optimization
The BeagleBone Black used for development in this project is running out of the box operating system (Debian) and no updates were installed on the system other than the necessary package installations to run this project.

### Directions for Installation
To install the directory you may wish to download a zip from our [NCSU GitHub Repository](https://github.ncsu.edu/wireless-sensors/HomeBrew) or run the command `git clone https://github.ncsu.edu/wireless-sensors/HomeBrew.git` while logged in to your BeagleBone. For the next part (or the github ) We used the directory  `~/../var/www/` since it is running a small web server. Install these packages while in your new HomeBrew directory to enable the javascript server to run:

```{r, engine='sh'}
root@beaglebone:/# npm install node
root@beaglebone:/# npm install --save express
root@beaglebone:/# npm install --save jsonfile
root@beaglebone:/# npm install --save body-parser
root@beaglebone:/# npm install --save ds18b20

```

#### Setting up the hardware:
When setting up your hardware, you may use just LEDs and temperature sensors, and you may only use one temperature sensor if you prefer. The following image shows how we set up our temperature sensor. You will need to go into server.js and assign the first temperature sensor id to the id of the one you are using (how to find this is indicated below). Comment out references to the second sensor id in server.js to use just one sensor. Please visit our project website for info on how to set up both.

images: ![alt text](https://github.ncsu.edu/wireless-sensors/HomeBrew/blob/master/img/old-circuit.png)

This image shows how we set up our heating and cooling components if you also wish to use these:

images: ![alt text](https://github.ncsu.edu/wireless-sensors/HomeBrew/blob/master/img/circuit.png)

Save this device tree file as w1.dts in your root folder on your BBBK.

```
/*
* Copyright (C) 2012 Texas Instruments Incorporated - http://www.ti.com/
*
* This program is free software; you can redistribute it and/or modify
* it under the terms of the GNU General Public License version 2 as
* published by the Free Software Foundation.
*
* Modified  by Russell Senior from the weather cape's DTS file.
* Minor formatting by C W Rose.
*/
/dts-v1/;
/plugin/;
 
/ {
    compatible = "ti,beaglebone", "ti,beaglebone-black";
    part-number = "BB-W1";
    version = "00A0";
 
    exclusive-use = "P8.11";
 
    fragment@0 {
        target = <&am33xx_pinmux>;
        __overlay__ {
             bb_w1_pins: pinmux_bb_w1_pins {
                 pinctrl-single,pins =  <0x34 0x37 /* gpmc_ad13.gpio1_13, OMAP_PIN_INPUT_PULLUP | OMAP_MUX_MODE7 - w1-gpio */ >;
             };
        };
    };
 
    fragment@1 {
        target = <&ocp>;
        __overlay__ {
            onewire@0 {
                status          = "okay";
                compatible      = "w1-gpio";
                pinctrl-names   = "default";
                pinctrl-0       = <&bb_w1_pins>;
 
                gpios = <&gpio2 13 0>;
            };
        };
    };
};
```

Build the file, then copy the built file to lib/firmware:

```{r, engine='sh'}
root@beaglebone:/# dtc -O dtb -o w1-00A0.dtbo -b 0 -@ w1.dts
root@beaglebone:/# cp w1-00A0.dtbo /lib/firmware
root@beaglebone:/# echo w1 > /sys/devices/bone_capemgr.9/slots
```

Running `cat /sys/devices/bone_capemgr.9/slots` should show a slot that says **Override Board Name** now. Run `echo w1 > /sys/devices/bone_capemgr.9/slots` every boot or put it in the boot file (/etc/rc.local);

### Running and Interacting with the server
To run the server after you have set up the software and hardware, go into your HomeBrew directory first.

Run `server.js` and immediately pull up http://127.0.0.1:5000/index.html in your browser. You can see them reacting to the environment based on the target temperature. Naviagte to create.html as linked in the navigation bar to add a new schedule. If you add a schedule right after the first sample next_schedule is finished running (the sample schedules are very short for demo purposes) you may refresh the page at index.html to view the next brew as it progresses.