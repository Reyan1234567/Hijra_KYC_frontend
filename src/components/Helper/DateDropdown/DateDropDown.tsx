import { MenuProps } from "antd";
import React from "react";
import DropDown from "./DropDown";

interface state {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

const DateDropDown = (state: state) => {
  const today = new Date();
  today.setHours(0);

  const Title = "Select Date";
  const setDay = (month: number) => {
    const thisMonth = new Date(today);
    thisMonth.setMonth(thisMonth.getMonth() - month, 1);
    state.setDate(thisMonth);
  };

  const setDateToJune = () => {
    const juneDate = new Date(today.getFullYear(), 5, 30); // June 30th of current year
    state.setDate(juneDate);
  };

  const currentYear = today.getFullYear();

  const July = new Date(currentYear, 6, 1);
  const August = new Date(currentYear, 7, 1);
  const September = new Date(currentYear, 8, 1);
  const October = new Date(currentYear, 9, 1);
  const November = new Date(currentYear, 10, 1);
  const December = new Date(currentYear, 11, 1);
  const June = new Date(currentYear, 5, 1);

  const betweenJulyAndAugust: MenuProps["items"] = [
    {
      key: "1",
      label: "This month",
      onClick: () => {
        const yatod = today;
        yatod.setDate(1);
        yatod.setHours(0);
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
        yatod.setHours(0);
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

  const SeptemberMonth: MenuProps["items"] = [
    {
      key: "1",
      label: "This month",
      onClick: () => {
        const yatod = today;
        yatod.setDate(1);
        yatod.setHours(0);
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
      key: "3",
      label: "Last 2 months",
      onClick: () => {
        setDay(2);
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
        yatod.setHours(0);
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
        setDay(4);
      },
    },
  ];

  const NovemberMonth: MenuProps["items"] = [
    {
      key: "1",
      label: "This month",
      onClick: () => {
        const yatod = today;
        yatod.setDate(1);
        yatod.setHours(0);
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
        setDay(4);
      },
    },
  ];

  const betweenDecemberAndJanuary: MenuProps["items"] = [
    {
      key: "1",
      label: "This month",
      onClick: () => {
        const yatod = today;
        yatod.setDate(1);
        yatod.setHours(0);
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
        setDay(4);
      },
    },
    {
      label: "Last 6 months",
      key: "4",
      onClick: () => {
        setDay(6);
      },
    },
  ];

  const JanuaryMonth: MenuProps["items"] = [
    {
      key: "1",
      label: "This month",
      onClick: () => {
        const yatod = today;
        yatod.setDate(1);
        yatod.setHours(0);
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
        setDay(4);
      },
    },
    {
      label: "Last 7 months",
      key: "4",
      onClick: () => {
        setDay(7);
      },
    },
  ];

  const FebruaryMonth: MenuProps["items"] = [
    {
      key: "1",
      label: "This month",
      onClick: () => {
        const yatod = today;
        yatod.setDate(1);
        yatod.setHours(0);
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
        setDay(4);
      },
    },
    {
      label: "Last 6 months",
      key: "4",
      onClick: () => {
        setDay(6);
      },
    },
    {
      label: "Last 8 months",
      key: "5",
      onClick: () => {
        setDay(8);
      },
    },
  ];

  const MarchMonth: MenuProps["items"] = [
    {
      key: "1",
      label: "This month",
      onClick: () => {
        const yatod = today;
        yatod.setDate(1);
        yatod.setHours(0);
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
        setDay(4);
      },
    },
    {
      label: "Last 6 months",
      key: "4",
      onClick: () => {
        setDay(6);
      },
    },
    {
      label: "Last 9 months",
      key: "5",
      onClick: () => {
        setDay(9);
      },
    },
  ];

  const AprilMonth: MenuProps["items"] = [
    {
      key: "1",
      label: "This month",
      onClick: () => {
        const yatod = today;
        yatod.setDate(1);
        yatod.setHours(0);
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
        setDay(4);
      },
    },
    {
      label: "Last 6 months",
      key: "4",
      onClick: () => {
        setDay(6);
      },
    },
    {
      label: "Last 8 months",
      key: "5",
      onClick: () => {
        setDay(8);
      },
    },
    {
      label: "Last 10 months",
      key: "6",
      onClick: () => {
        setDay(10);
      },
    },
  ];

  const MayMonth: MenuProps["items"] = [
    {
      key: "1",
      label: "This month",
      onClick: () => {
        const yatod = today;
        yatod.setDate(1);
        yatod.setHours(0);
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
        setDay(4);
      },
    },
    {
      label: "Last 6 months",
      key: "4",
      onClick: () => {
        setDay(6);
      },
    },
    {
      label: "Last 8 months",
      key: "5",
      onClick: () => {
        setDay(8);
      },
    },
    {
      label: "Last 11 months",
      key: "6",
      onClick: () => {
        setDay(11);
      },
    },
  ];

  const afterJune: MenuProps["items"] = [{
      key: "1",
      label: "This month",
      onClick: () => {
        const yatod = today;
        yatod.setDate(1);
        yatod.setHours(0);
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
        setDay(4);
      },
    },
    {
      label: "Last 6 months",
      key: "4",
      onClick: () => {
        setDay(6);
      },
    },
    {
      label: "Last 8 months",
      key: "4",
      onClick: () => {
        setDay(8);
      },
    },
    {
      label: "Last 10 months",
      key: "4",
      onClick: () => {
        setDay(10);
      },
    },
        {
      label: "Last 12 months",
      key: "4",
      onClick: () => {
        setDay(12);
      },
    },
  ];

  return (
    <>
      {August > today && today >= July && (
        <DropDown
          menu={betweenJulyAndAugust}
          onChange={() => {}}
          title={Title}
        />
      )}
      {September > today && today >= August && (
        <DropDown
          menu={betweenAugustAndOctober}
          onChange={() => {}}
          title={Title}
        />
      )}
      {October > today && today >= September && (
        <DropDown menu={SeptemberMonth} onChange={() => {}} title={Title} />
      )}
      {November > today && today >= October && (
        <DropDown
          menu={betweenOctoberAndDecember}
          onChange={() => {}}
          title={Title}
        />
      )}
      {December > today && today >= November && (
        <DropDown menu={NovemberMonth} onChange={() => {}} title={Title} />
      )}
      {today >= December && today.getMonth() === 11 && (
        <DropDown
          menu={betweenDecemberAndJanuary}
          onChange={() => {}}
          title={Title}
        />
      )}
      {today.getMonth() === 0 && (
        <DropDown menu={JanuaryMonth} onChange={() => {}} title={Title} />
      )}
      {today.getMonth() === 1 && (
        <DropDown menu={FebruaryMonth} onChange={() => {}} title={Title} />
      )}
      {today.getMonth() === 2 && (
        <DropDown menu={MarchMonth} onChange={() => {}} title={Title} />
      )}
      {today.getMonth() === 3 && (
        <DropDown menu={AprilMonth} onChange={() => {}} title={Title} />
      )}
      {today.getMonth() === 4 && (
        <DropDown menu={MayMonth} onChange={() => {}} title={Title} />
      )}
      {today.getMonth() === 5 && (
        <DropDown menu={afterJune} onChange={() => {}} title={Title} />
      )}
    </>
  );
};

export default DateDropDown;
