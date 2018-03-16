# Zeplin Surgical Extension

Generates [Surgical](https://github.com/syranide/surgical) JavaScript snippets from colors, text styles and layers. 

*Borrows a lot of inspiration and code from the 
[zpelin/react-native-extension](https://github.com/zeplin/react-native-extension)*

Sample colors output:
```js
const colors = {
  red: "#ff0000",
  green: "#00ff00",
  blue: "#0000ff",
  yellow: "#ffff00",
  black: "#000000",
  black50: "rgba(0, 0, 0, 0.5)",
  white: "#ffffff"
};
```

Sample text style output:
```js
const textStyles = {
  sampleTextStyle: {
    fontFamily: "SFProText",
    fontSize: 20,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left"
  },
  sampleTextStyleWithColor: {
    fontFamily: "SFProText",
    fontSize: 20,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: colors.red
  }
};
```

Sample layer output:
```js
declare(SG.Element, {
    tagName: 'p',
    className: 'loggain',
    style: {
        'width': '108.5px',
        'height': '17.5px',
        'font-family': 'SeatBcn',
        'font-size': '12px',
        'font-weight': 'bold',
        'font-style': 'normal',
        'letter-spacing': '0.92px',
        'text-align': 'center',
        'color': colors.white
    },
    children: [
        declare(SG.Text, 'Till min profil'),        
    ],
}), // p
```
***Note:*** *Setting inline styles in javascript is expensive, for larger applications you should extend* 
`SurgicalElement` *to write styles into an inline stylesheet instead as classes and update the nodes classList instead 
of styles.*

## Options

#### Color format

Supports HEX, RGB or HSL. Sample colors output as HSL:
```js
const colors = {
  red: "hsl(0, 100%, 50%)",
  black50: "hsla(0, 0%, 0%, 0.5)"
};
```

#### Dimensions

Toggles generating `width` and `height` properties from layers.

### Default tagName (div)

The default tagName that will be used when the extension can't guess which tagName should be suggested or selected 
object is of type `shape`.

#### Default values

Toggles always generating default values from layers or text styles, such as `fontWeight` and `fontStyle`.

## @TODO

- Add options to be able to set how `SurgicalText` and `SurgicalElement` is imported in your enviroment.
- Add option for default `text`-layerType tagName, atm `tagName: 'p'.
- Improve "Default tagName" suggestions, atm it only checks layerType. 
- Finish styleguide **Text styles** output, atm it's not very useful.
- Wrap props in styleguide **Color palette** with `'` and replace `"` in values with `'` it will look like:
  ```
  const colors = {
    'red': '#ff0000',
    'green-2': '#00ff00'
  };
  ```
- s
## Development

Zeplin Surgical extension is developed using [zem](https://github.com/zeplin/zem), Zeplin Extension Manager. zem is a 
command line tool that lets you quickly create and test extensions.

To learn more about zem, [see documentation](https://github.com/zeplin/zem).