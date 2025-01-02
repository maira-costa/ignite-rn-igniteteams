//npx expo install @react-native-async-storage/async-storage
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GROUP_COLLECTION } from "../storageConfig";
import { groupsGetAll } from "./groupGetAll";
import { AppError } from "@/utils/AppError";

export async function groupCreate(newGroup:string) {
  try {
    const storedGroups = await groupsGetAll();
    const groupAlreadyExists = storedGroups.includes(newGroup);

    if(groupAlreadyExists) {
      // A declaração throw lança uma exceção customizada
      throw new AppError('Já existe um grupo cadastrado com esse nome.');
    }
    const storage = JSON.stringify([...storedGroups, newGroup]);
    await AsyncStorage.setItem(GROUP_COLLECTION, storage);
  } catch (error) {
    throw error;
  }
}