import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { createGoal } from "../features/goals/goalsSlice";

const GaolForm = () => {
  const dispatch = useAppDispatch();
  const [text, setText] = useState<string>("");

  const {isError, isLoading, isSuccess, goals, message} = useAppSelector((store) => store.goals)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) { 
      return toast.error("Please add Text");
    }

    dispatch(createGoal({ text }));

    setText("");
  };

  return (
    <section className="form">
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Goal</label>
          <input
            type="text"
            name="text"
            value={text}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setText(e.target.value)
            }
          />
        </div>

        <div className="form-group">
          <button className="btn btn-block" type="submit">
            Add Goal
          </button>
        </div>
      </form>
    </section>
  );
};

export default GaolForm;
