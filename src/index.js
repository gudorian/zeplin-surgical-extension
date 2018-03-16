/**
 * Zeplin extension for Surgical Javascript Library (https://github.com/syranide/surgical).
 *
 * Based on (borrowed a lot of) code from the https://github.com/zeplin/SURGICAL-native-extension repo.
 */
import {
    getStyleguideColorsCode,
    getStyleguideTextStylesCode,
    getLayerCode
} from "./code-helpers";

import { OPTION_NAMES } from "./constants";

function layer(context, selectedLayer) {
    let options = {
        showDimensions: context.getOption(OPTION_NAMES.SHOW_DIMENSIONS),
        colorFormat: context.getOption(OPTION_NAMES.COLOR_FORMAT),
        defaultValues: context.getOption(OPTION_NAMES.SHOW_DEFAULT_VALUES),
        defaultTagName: context.getOption(OPTION_NAMES.DEFAULT_TAG_NAME),
    };
    let code = getLayerCode(context.project, selectedLayer, options);

   /* return {
        code: JSON.stringify(selectedLayer),
        language: 'javascript',
    };*/

    return {
        code: code,
        language: "javascript"
    };
}

function styleguideColors(context, colors) {
    let options = { colorFormat: context.getOption(OPTION_NAMES.COLOR_FORMAT) };
    let code = getStyleguideColorsCode(options, colors);

    return {
        code: code,
        language: "javascript"
    };
}

function styleguideTextStyles(context, textStyles) {
    let options = {
        colorFormat: context.getOption(OPTION_NAMES.COLOR_FORMAT),
        defaultValues: context.getOption(OPTION_NAMES.SHOW_DEFAULT_VALUES)
    };
    let code = getStyleguideTextStylesCode(options, context.project, textStyles);

    return {
        code: code,
        language: "javascript"
    };
}

function exportStyleguideColors(context, colors) {
    let codeObject = styleguideColors(context, colors);
    let code = codeObject.code;

    return {
        code: code,
        filename: "colors.js",
        language: "javascript"
    };
}

function exportStyleguideTextStyles(context, textstyles) {
    let codeObject = styleguideTextStyles(context, textstyles);
    let code = codeObject.code;

    return {
        code: code,
        filename: "fonts.js",
        language: "javascript"
    };
}

function comment(context, text) {

    return `// ${text}`;
}

export default {
    layer,
    styleguideColors,
    styleguideTextStyles,
    exportStyleguideColors,
    exportStyleguideTextStyles,
    comment
};