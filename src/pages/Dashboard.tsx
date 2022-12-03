import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import GaolForm from "../components/GoalForm";
import GoalItem from "../components/GoalItem";
import Spinner from "../components/Spinner";
import { getGoals } from "../features/goals/goalsSlice";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((store) => store.auth);
  const { goals, isError, isLoading, message } = useAppSelector(
    (store) => store.goals
  );

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    //@ts-ignore
    dispatch(getGoals());
  }, [user, navigate, dispatch, isError, message]);

  console.log(goals);
  if (isLoading) return <Spinner />;
  return (
    <>
      <section className="heading">
        <h1>Welcome {user && user.name}</h1>
        <p>Goals Dashboard</p>
      </section>
      <GaolForm />
      <section className="content">
        {goals.length > 0 ? (
          <div className="goals">
            {goals.map((goal) => (
              <GoalItem goal={goal} key={goal._id} dataId={goal._id}/>
            ))}
          </div>
        ) : (
          <h3>You Do not have any goal</h3>
        )}
      </section>
    </>
  );
};

export default Dashboard;
