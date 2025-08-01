import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps } from "antd";

interface dropDownInterface {
  menu: MenuProps["items"];
  onChange: () => void;
  title?:string;
}

const DropDown = (drop: dropDownInterface) => (
  <Dropdown
    menu={{ items: drop.menu }}
    trigger={["click"]}
    onOpenChange={(open) => {
      if (open) {
        drop.onChange();
      }
    }}
  >
    <Button>
      {drop.title==null?"Actions":drop.title}
      <DownOutlined />
    </Button>
  </Dropdown>
);

export default DropDown;
