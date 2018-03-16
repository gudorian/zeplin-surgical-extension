import {
    generateLayerStyleObject,
    generateStyleguideTextStylesObject
} from "./style-object-helpers";
import {
    generateName,
    getColorMapByFormat,
    getColorStringByFormat
} from "../utils";

import { SURGICAL_RULES_WITH_COLOR, JSON_SPACING, LAYER_TYPE_TAGNAME } from "../constants";

function indent(depth = 1) {

    return ' '.repeat(JSON_SPACING * depth);
}

function generateSurgicalRule(styleObj, projectColorMap, children = null, tagName = 'div', textLengthUnit = '') {
    let selector = styleObj.selector;
    delete styleObj.selector;
    let styleObjSurgical = {};

    Object.keys(styleObj).forEach((prop) => {
        if (prop === "mixinEntry") {

            return;
        }

        if (SURGICAL_RULES_WITH_COLOR.includes(prop) && styleObj[prop] in projectColorMap) {
            styleObj[prop] = `colors.${projectColorMap[styleObj[prop]]}`
                .replace(/"(.+)":/g, "'$1:'");
        }

        let surgicalProp = prop
            .replace(/([A-Z])/g, '-' + '$1')
            .toLowerCase();
        styleObjSurgical[surgicalProp] = styleObj[prop];
    });

    let selectorName = generateName(selector);

    let styleObjText = JSON.stringify(styleObjSurgical, null, JSON_SPACING)
        .replace(/"(.+)":/g, indent(1) + "'$1':") // prop
        //.replace(/: "(.+)"/g, "': $1'") // value
        .replace(/: ([0-9\.\-]+)/g, `: '$1${textLengthUnit}'`)
        .replace(/: "(.+)"/g, ": '$1'")
        .replace(/: 'colors\.(.*)'/g, ": colors.$1");

    

    return `declare(SG.Element, {\n`
           + `${indent()}tagName: '${tagName}',\n`
           + `${indent()}className: '${selectorName.toLowerCase()}',\n`
           + `${indent()}style: ${styleObjText.replace(/^(\}$)/m, `${indent()}$1`)},\n`
           + `${indent()}children: [\n`
           + (children || '')
           + `${indent(2)}\n`
           + `${indent()}],\n`
           + `}), // ${tagName}`
    ;

    return `const ${selectorName} = ${styleObjText};`;
}

function getStyleguideColorTexts(colorFormat, colors) {
    return colors.map(color => {
        let colorStyleObject = getColorStringByFormat(
            color,
            colorFormat
        );

        return `  ${color.name}: "${colorStyleObject}"`;
    });
}

function getStyleguideColorsCode(options, colors) {
    let { colorFormat } = options;
    let styleguideColorTexts = getStyleguideColorTexts(colorFormat, colors);

    return `const colors = {\n${styleguideColorTexts.join(",\n")}\n};`;
}

function getStyleguideTextStylesCode(options, project, textStyles) {
    let textStylesObj = generateStyleguideTextStylesObject(options, project, textStyles);

    let textStylesStr = JSON.stringify(textStylesObj, null, JSON_SPACING);
    let processedTextStyles = textStylesStr.replace(/"(.+)":/g, "$1:").replace(/: "colors\.(.*)"/g, ": colors.$1");

    return `const textStyles = ${processedTextStyles};`;
}

function getLayerCode(project, layer, options) {
    let { showDimensions, colorFormat, defaultValues, defaultTagName } = options;

    let layerStyleRule = generateLayerStyleObject({
        layer,
        projectType: project.type,
        densityDivisor: project.densityDivisor,
        showDimensions,
        colorFormat,
        defaultValues
    });

    let cssObjects = [];

    if (Object.keys(layerStyleRule).length > 1) {
        cssObjects.unshift(layerStyleRule);
    }

    return cssObjects.map(cssObj =>
        generateSurgicalRule(
            cssObj,
            getColorMapByFormat(project.colors, options.colorFormat),
            getLayerContentAsChild(layer),
            getSuggestedTagName(layer.type, defaultTagName || ''),
            project.textLengthUnit,
        )
    ).join("\n\n");
}

function getLayerContentAsChild(layer) {
    let content = null;
    if (layer && layer.content) {
        content = `${indent(2)}declare(SG.Text, '${layer.content.replace(/'/g, '\\\'')}'),`;
    }

    return content;
}

function getSuggestedTagName(layerType, defaultTagName) {
    let tagName = defaultTagName;

    if (LAYER_TYPE_TAGNAME.hasOwnProperty(layerType)) {
        tagName = LAYER_TYPE_TAGNAME[layerType] === '__DEFAULT__' ? defaultTagName : LAYER_TYPE_TAGNAME[layerType];
    }

    return tagName;
}

export {
    getStyleguideColorsCode,
    getStyleguideTextStylesCode,
    getLayerCode
};
