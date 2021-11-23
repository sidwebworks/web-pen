import { useSelector } from "react-redux";
import { RootState } from "../../redux";

export const useActions = <T>(fn: (s: RootState) => any) => useSelector<RootState, T>(fn);
