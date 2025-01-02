import { useState, useCallback } from "react";
import { FlatList } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Container } from "./styles";
import { groupsGetAll } from "@/storage/group/groupGetAll";
import { Header } from "@/components/Header";
import { Highlight } from "@/components/Highlight";
import { GroupCard } from "@/components/GroupCard";
import { ListEmpty } from "@/components/ListEmpty";
import { Button } from "@/components/Button";

export function Groups() {
  const [groups, setGroups] = useState<string[]>([]);

  const navigation = useNavigation();

  function handleNewGroup() {
    //Tem acesso a todas as rotas por meio da tipage feita em navigation.d.ts
    navigation.navigate("new");
  }

  async function fetchGroups() {
    try {
      const data = await groupsGetAll();
      setGroups(data);
    } catch (error) {
      console.log(error);
    }
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
      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <GroupCard title={item} />}
        contentContainerStyle={groups.length === 0 && { flex: 1 }}
        ListEmptyComponent={
          <ListEmpty message="Que tal cadastrar a primeira turma?" />
        }
      />
      <Button title="Criar nova turma" onPress={handleNewGroup} />
    </Container>
  );
}
