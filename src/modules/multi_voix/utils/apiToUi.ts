import type { CompletedMultiResponse } from "../types/apiResponse.types";
import type { BulleTextDiarization, Speaker, UiDiarizationResult } from "../types/uiData.types";
    
// Renvoie un code haxadécimal aléatoire en fonction du string passé en paramètre
const randomColorGenerator = (id : string): string => {
    const hashCode = (str: string): number => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }

    const intToRGB = (i: number): string => {
        const c = (i & 0x00FFFFFF)
            .toString(16)
            .toUpperCase();
        return "00000".substring(0, 6 - c.length) + c;
    }

    return '#' + intToRGB(hashCode(id));
}

// Fonction pour convertir la réponse de l'API en format adapté à l'UI
export const convertApiToUiData = (apiData: CompletedMultiResponse): UiDiarizationResult => {
    const speakersById: Record<string, Speaker> = {};
    const conversationFlow: BulleTextDiarization[] = [];

    for (const segment of apiData.data.result.segments) {
        // Si le speaker n'existe pas encore dans la "base de données", on le crée
        if (!speakersById[segment.speaker]) {
            speakersById[segment.speaker] = {
                id: segment.speaker,
                name: `${segment.speaker}`,
                color: randomColorGenerator(segment.speaker), // Génère une couleur aléatoire pour chaque speaker
            };
        }
        // On ajoute le segment à la conversationFlow
        conversationFlow.push({
            segments: [segment],
            speakerId: segment.speaker,
        });
    }
    return {
        conversationFlow,
        speakersById,
    };
}