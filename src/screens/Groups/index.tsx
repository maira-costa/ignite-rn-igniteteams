import { useState, useCallback } from "react";
import { Alert, FlatList } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Container } from "./styles";
import { groupsGetAll } from "@/storage/group/groupGetAll";
import { Header } from "@/components/Header";
import { Highlight } from "@/components/Highlight";
import { GroupCard } from "@/components/GroupCard";
import { ListEmpty } from "@/components/ListEmpty";
import { Button } from "@/components/Button";
import { Loading } from "@/components/Loading";

export function Groups() {
  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<string[]>([]);

  const navigation = useNavigation();

  function handleNewGroup() {
    //Tem acesso a todas as rotas por meio da tipage feita em navigation.d.ts
    navigation.navigate("new");
  }

  async function fetchGroups() {
    try {
      setIsLoading(true);
      const data = await groupsGetAll();
      setGroups(data);
    } catch (error) {
      console.log(error);
      Alert.alert("Turmas", "Não foi possível carregar as turmas");
    } finally {
      setIsLoading(false);
    }
  }

  function handleOpenGroup(group: string) {
    navigation.navigate("players", { group });
  }

  //useFocusEffect é melhor que useEffect nesse caso porque há uma renderização sempre que a tela está em foco
  //Devemos sempre envolver o resultado do useEffect com o useCallback
  useFocusEffect(
    useCallback(() => {
      fetchGroups();
    }, [])
  );

  return (
    <Container>
      <Header />
      <Highlight title="Turmas" subtitle="jogue com a sua turma" />
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <GroupCard title={item} onPress={() => handleOpenGroup(item)} />
          )}
          contentContainerStyle={groups.length === 0 && { flex: 1 }}
          ListEmptyComponent={
            <ListEmpty message="Que tal cadastrar a primeira turma?" />
          }
        />
      )}
      <Button title="Criar nova turma" onPress={handleNewGroup} />
    </Container>
  );
}
