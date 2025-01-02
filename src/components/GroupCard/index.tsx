import { TouchableOpacityProps } from "react-native";
import { Container, Icon, Title } from "./styles";

//Fazemos a união entre tipos, recurso do typescript, para acessar as props do TouchableOpacity
type Props = TouchableOpacityProps & {
  title: string;
};

//Passamos todas as props do TouchableOpacity via parâmetro rest
export function GroupCard({ title, ...rest }: Props) {
  return (
    <Container {...rest}>
      <Icon />
      <Title>{title}</Title>
    </Container>
  );
}
