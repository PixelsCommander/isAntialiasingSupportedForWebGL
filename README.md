# Is Antialiasing Supported? For WebGL ![Image of check sign](./check.jpeg)

You probably heard about WebGL context ```antialias``` property. The interesting fact is that having `true` as a value there does not guarantee antialiasing to be actually enabled. It works just as a hint for browser but there are many reasons it might be disabled and you d like to react on this. For example by enabling shader-based FSAA.

With this library you can actually check if AA works for this machine. Once executed it adds ```window.antialiasingSupported: boolean``` property which is ```true``` if AA is available.

[Demo](http://pixelscommander.com/polygon/aatest/demo/)

## Usage

```npm install isantialiasingsupported```

include into your project and after you may check for

```if (window.antialiasingSupported) ...```

## How this works?

Library creates tiny detached canvas and draws triangle on it with WebGL.

![Image of Yaktocat](./test.png)

If triangle have any pixels except white and black then it is antialiased and ```window.antialiasingSupported``` is set to ```true```.

## License

MIT: http://mit-license.org/

Copyright 2018 Denis Radin aka [PixelsCommander](http://pixelscommander.com)

## Credits

Inspired by my work at [Evolution Gaming](https://www.evolutiongamingcareers.com/search-jobs/?department=Engineering&country=)