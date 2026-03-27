import type {UiDiarizationResult} from "../types/uiData.types.ts";
// Fonction pour obtenir le flux de conversation complet à partir de la réponse de l'API
export const fullText = (param: UiDiarizationResult): string => {
    let text = '';
    let name = '';
    for (const bulle of param.conversationFlow) {
        name = param.speakersById[bulle.speakerId]?.name || bulle.speakerId;
        text += `\n[${name}]: \n`;
        for (const segment of bulle.segments) {
            text += segment.text + ' ';
        }
    }
    return text.trim();
};