import { MenuProps } from "antd";
import React from "react";
import DropDown from "./DropDown";

interface state {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

const DateDropDown = (state: state) => {
  const today = new Date();

  const setDay = (month: number) => {
    const thisMonth = today;
    thisMonth.setMonth(thisMonth.getMonth() - month, 1);
    state.setDate(thisMonth);
  };

  const June = new Date(today.getFullYear(), 6, 1);
  const July = new Date(today.getFullYear(), 7, 1);
  const August = new Date(today.getFullYear(), 8, 1);
  const December = new Date(today.getFullYear(), 12, 1);
  const February = new Date(today.getFullYear(), 2, 1);

  const aroundJuly: MenuProps["items"] = [
    {
      key: "1",
      label: "This month",
      onClick: () => {
        const yatod = today;
        yatod.setDate(1);
        state.setDate(yatod);
      },
    },
  ];

  const aroundAugust: MenuProps["items"] = [
    {
      key: "1",
      label: "This month",
      onClick: () => {
        const yatod = today;
        yatod.setDate(1);
        state.setDate(yatod);
      },
    },
    {
      key: "2",
      label: "Last month",
      onClick: () => {
        setDay(1);
      },
    },
  ];

  const aroundDecember: MenuProps["items"] = [
    {
      key: "1",
      label: "This month",
      onClick: () => {
        const yatod = today;
        yatod.setDate(1);
        state.setDate(yatod);
      },
    },
    {
      key: "2",
      label: "Last month",
      onClick: () => {
        setDay(1);
      },
    },
    {
      label: "Last 4 months",
      key: "3",
      onClick: () => {
        setDay(3);
      },
    },
  ];

  const aroundFebruary: MenuProps["items"] = [
    {
      key: "1",
      label: "This month",
      onClick: () => {
        const yatod = today;
        yatod.setDate(1);
        state.setDate(yatod);
      },
    },
    {
      key: "2",
      label: "Last month",
      onClick: () => {
        setDay(1);
      },
    },
    {
      label: "Last 4 months",
      key: "3",
      onClick: () => {
        setDay(3);
      },
    },
    {
      label: "Last 6 months",
      key: "4",
      onClick: () => {
        setDay(5);
      },
    },
  ];

  const aroundJune: MenuProps["items"] = [
    {
      key: "1",
      label: "This month",
      onClick: () => {
        const yatod = today;
        yatod.setDate(1);
        state.setDate(yatod);
      },
    },
    {
      key: "2",
      label: "Last month",
      onClick: () => {
        setDay(1);
      },
    },
    {
      label: "Last 4 months",
      key: "3",
      onClick: () => {
        setDay(3);
      },
    },
    {
      label: "Last 6 months",
      key: "4",
      onClick: () => {
        setDay(5);
      },
    },
    {
      label: "Last year",
      key: "5",
      onClick: () => {
        setDay(11);
      },
    },
  ];
  return (
    <>
      {today > June && <DropDown menu={aroundJune} onChange={() => {}} />}
      {today > July && <DropDown menu={aroundJuly} onChange={() => {}} />}
      {today > August && <DropDown menu={aroundAugust} onChange={() => {}} />}
      {today > December && (
        <DropDown menu={aroundDecember} onChange={() => {}} />
      )}
      {today > February && (
        <DropDown menu={aroundFebruary} onChange={() => {}} />
      )}
    </>
  );
};

export default DateDropDown;
