import { playersGetByGroup } from "./playersGetByGroup"

export async function playersGetByGroupAndTeams(group: string, team: string) {
  try {
    const storage = playersGetByGroup(group);
    const players = (await storage).filter(player => player.team === team);
    return players
  } catch (error) {
    throw(error);
  }
}