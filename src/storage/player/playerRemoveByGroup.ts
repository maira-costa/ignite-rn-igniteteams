import AsyncStorage from "@react-native-async-storage/async-storage";

import { PLAYER_COLLECTION } from "../storageConfig";
import { playersGetByGroup } from "./playersGetByGroup";

export async function playerRemoveByGroup(playerName: string, group: string) {
  try {
    const storage = await playersGetByGroup(group); // Seleciona o grupo

    const filtered = storage.filter(player => player.name !== playerName); // Cria uma lista sem o player selecionado
    const players = JSON.stringify(filtered); // Transforma a lista em texto
    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, players); // Adiciona a lista à coleção do grupo selecionado

  } catch (error) {
    throw error;
  }
}