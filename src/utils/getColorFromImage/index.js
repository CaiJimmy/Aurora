import * as Vibrant from 'node-vibrant'

export default function getColorFromImage (imageURL) {
    return Vibrant.from(imageURL).getPalette()
        .then((palette) => {
            window.test = palette;
            return {
                DarkMuted: palette.DarkMuted.getHex(),
                DarkVibrant: palette.DarkVibrant.getHex(),
                LightMuted: palette.LightMuted.getHex(),
                LightVibrant: palette.LightVibrant.getHex(),
                Muted: palette.Muted.getHex(),
                Vibrant: palette.Vibrant.getHex()
            };
        });
}