/**
 * DROPDOWN COMPONENT
 *
 * TYPE: Helper Component (All Roles)
 * PURPOSE: Reusable dropdown button component for action menus and selections
 *
 * FUNCTIONALITY:
 * - Generic dropdown wrapper around Ant Design Dropdown component
 * - Configurable menu items via props
 * - Customizable title with fallback to "Actions"
 * - Click trigger with selectable menu items
 * - onChange callback when dropdown opens
 *
 * USER INTERACTIONS:
 * - Button click to open dropdown menu
 * - Menu item selection from provided options
 * - Automatic dropdown close after selection
 * - Visual down arrow indicator
 *
 * STATE MANAGEMENT:
 * - Stateless component - receives all data via props
 * - Triggers onChange callback when dropdown opens
 * - Menu items handle their own click events
 *
 * USAGE: Used throughout the application for:
 * - Action menus in table rows (View, Edit, Delete, etc.)
 * - Date selection menus (DateDropDown component)
 * - Status-based action dropdowns
 * - Any context-sensitive menu requirements
 */

import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps } from "antd";

interface dropDownInterface {
  menu: MenuProps["items"];
  onChange: () => void;
  title?: string;
}

const DropDown = (drop: dropDownInterface) => (
  <Dropdown
    menu={{ items: drop.menu, selectable: true }}
    trigger={["click"]}
    onOpenChange={(open) => {
      if (open) {
        drop.onChange();
      }
    }}
  >
    <Button>
      {drop.title == null ? "Actions" : drop.title}
      <DownOutlined />
    </Button>
  </Dropdown>
);

export default DropDown;
