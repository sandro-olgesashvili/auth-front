import { useAppDispatch } from "../app/hooks";
import { deleteGoal } from "../features/goals/goalsSlice";

interface Goal {
  text: string;
  createdAt?: string;
}


interface Props {
  goal: Goal;
  dataId: any
}



const GoalItem: React.FC<Props> = ({ goal, dataId }) => {
  const dispatch = useAppDispatch();

  
  return (
    <div className="goal">
      <div>
        {
          //@ts-ignore
          new Date(goal.createdAt).toLocaleString()
        }
      </div>
      <h2>{goal.text}</h2>
      <button className="close" onClick={() => dispatch(deleteGoal(dataId))}>X</button>
    </div>
  );
};

export default GoalItem;
