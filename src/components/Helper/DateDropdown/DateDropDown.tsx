import { MenuProps } from "antd";
import React from "react";
import DropDown from "./DropDown";

interface state {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

const DateDropDown = (state: state) => {
  const today = new Date();

  const Title="Select Date"
  const setDay = (month: number) => {
    const thisMonth = today;
    thisMonth.setMonth(thisMonth.getMonth() - month, 1);
    state.setDate(thisMonth);
  };

  const July = new Date(today.getFullYear(), 6, 1);
  const August = new Date(today.getFullYear(), 7, 1);
  const October = new Date(today.getFullYear(), 9, 1);
  const December = new Date(today.getFullYear(), 11, 1);
  const June = new Date(today.getFullYear() + 1, 5, 1);

  const betweenJulyAndAugust: MenuProps["items"] = [
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

  const betweenAugustAndOctober: MenuProps["items"] = [
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

  const betweenOctoberAndDecember: MenuProps["items"] = [
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

  const betweenDecemberAndJune: MenuProps["items"] = [
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

  const afterJune: MenuProps["items"] = [
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
      {August > today && today >= July && (
        <DropDown  menu={betweenJulyAndAugust} onChange={() => { }} title={Title} />
      )}
      {October > today && today >= August && (
        <DropDown menu={betweenAugustAndOctober} onChange={() => { } } title={Title} />
      )}
      {December > today && today >= October && (
        <DropDown menu={betweenOctoberAndDecember} onChange={() => { } } title={Title} />
      )}
      {June > today && today >= December && (
        <DropDown menu={betweenDecemberAndJune} onChange={() => { } } title={Title} />
      )}
      {today > June && <DropDown menu={afterJune} onChange={() => { } } title={Title} />}
    </>
  );
};

export default DateDropDown;
