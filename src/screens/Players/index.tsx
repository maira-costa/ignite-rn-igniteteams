import { useEffect, useState, useRef } from "react";
import { Alert, FlatList, TextInput } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

import { AppError } from "@/utils/AppError";

import { playerAddByGroup } from "@/storage/player/playerAddByGroup";
import { PlayerStorageDTO } from "@/storage/player/PlayerStorageDTO";
import { playersGetByGroupAndTeams } from "@/storage/player/playersGetByGroupAndTeam";
import { playerRemoveByGroup } from "@/storage/player/playerRemoveByGroup";
import { groupRemoveByName } from "@/storage/group/groupRemoveByName";

import { Header } from "@/components/Header";
import { Loading } from "@/components/Loading";
import { Highlight } from "@/components/Highlight";
import { ButtonIcon } from "@/components/ButtonIcon";
import { Input } from "@/components/Input";
import { Filter } from "@/components/Filter";
import { PlayerCard } from "@/components/PlayerCard";
import { ListEmpty } from "@/components/ListEmpty";
import { Button } from "@/components/Button";

import { Container, Form, NumberOfPlayers, HeaderList } from "./styles";

type RouteParams = {
  group: string;
};

export function Players() {
  const [isLoading, setIsLoading] = useState(true);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [team, setTeam] = useState("Time A");
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);
  const newPlayerNameInputRef = useRef<TextInput>(null); // Controla propriedades do input sem necessariamente renderizar novamente a interface

  const navigation = useNavigation();
  const route = useRoute();
  const { group } = route.params as RouteParams;

  async function handleAddPlayer() {
    if (newPlayerName.trim().length === 0) {
      return Alert.alert(
        "Nova pessoa",
        "Informe o nome da pessoa para adicionar."
      );
    }

    const newPlayer = {
      name: newPlayerName,
      team,
    };

    try {
      await playerAddByGroup(newPlayer, group);
      newPlayerNameInputRef.current?.blur(); //Tira o foco do input ao adicionar um player
      setNewPlayerName("");
      fetchPlayersByTeam();
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert("Nova pessoa", error.message);
      } else {
        console.log(error);
        Alert.alert("Nova pessoa", "Não foi possível adicionar.");
      }
    }
  }

  async function fetchPlayersByTeam() {
    try {
      setIsLoading(true);
      const playersByTeam = await playersGetByGroupAndTeams(group, team);
      setPlayers(playersByTeam);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Pessoas",
        "Não foi possível carregar as pessoas do time selecionado."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePlayerRemove(playerName: string) {
    try {
      await playerRemoveByGroup(playerName, group); // Remove o player de acordo com o grupo(o grupo é passado pela própria rota)
      fetchPlayersByTeam(); // Renderiza a lista de players novamente
    } catch (error) {
      console.log(error);
      Alert.alert("Remover pessoa", "Não foi possível remover essa pessoa.");
    }
  }

  async function groupRemove() {
    try {
      await groupRemoveByName(group);
      navigation.navigate("groups");
    } catch (error) {
      console.log(error);
      Alert.alert("Remover turma", "Não foi possivel remover a turma");
    }
  }

  async function handleGroupRemove() {
    Alert.alert("Remover", "Deseja remover a turma?", [
      { text: "Não", style: "cancel" },
      { text: "Sim", onPress: () => groupRemove() },
    ]);
  }

  // É uma boa prática deixar o useEffect logo antes do return
  useEffect(() => {
    fetchPlayersByTeam();
  }, [team]); // Assim que houver alteração no team, a tela faz o reload

  return (
    <Container>
      <Header showBackButton />
      <Highlight title={group} subtitle="adicione a galera e separe os times" />
      <Form>
        <Input
          inputRef={newPlayerNameInputRef}
          value={newPlayerName}
          placeholder="Nome da pessoa"
          autoCorrect={false}
          onChangeText={setNewPlayerName}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
        />
        <ButtonIcon icon="add" onPress={handleAddPlayer} />
      </Form>
      <HeaderList>
        <FlatList
          data={["Time A", "Time B"]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Filter
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
          horizontal
        />
        <NumberOfPlayers>{players.length}</NumberOfPlayers>
      </HeaderList>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={players}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <PlayerCard
              name={item.name}
              onRemove={() => handlePlayerRemove(item.name)}
            />
          )}
          ListEmptyComponent={() => (
            <ListEmpty message="Não há pessoas nesse time." />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            { paddingBottom: 100 },
            players.length === 0 && { flex: 1 },
          ]}
        />
      )}
      <Button
        title="Remover turma"
        type="SECONDARY"
        onPress={handleGroupRemove}
      />
    </Container>
  );
}
