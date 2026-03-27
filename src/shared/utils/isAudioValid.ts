// Fonction utilitaire pour valider l'authenticité de l'audio
export const isAudioValid = (file: File, MAX_SIZE_MO: number) => {

    const MAX_SIZE = MAX_SIZE_MO * 1048576; 

        if (!file.type.startsWith("audio/")) {
            return {"message" : "Le fichier n'est pas un fichier audio !", "type": "error"};
        }

        if (file.size > MAX_SIZE) {
            return {"message" : `Le fichier dépasse la taille maximale autorisée (${MAX_SIZE_MO} Mo) !`, "type": "error"};
        }

        return true;
}