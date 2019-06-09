import analyze from 'rgbaster'

export default async function getColorFromImage(imageURL){
    const result = await analyze(imageURL);
    return result[0].color;
}