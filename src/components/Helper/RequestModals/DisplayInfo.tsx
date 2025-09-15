/**
 * DISPLAY INFO COMPONENT
 * 
 * TYPE: Helper Component (All Roles)
 * PURPOSE: Comprehensive KYC form information display with images and rejection reasons
 * CALLS: MakeInfo, BackReason
 * 
 * FUNCTIONALITY:
 * - Combines MakeInfo, image gallery, and BackReason components
 * - Displays KYC form images with descriptions in a responsive grid
 * - Shows rejection reasons when applicable
 * - Handles empty image state with fallback message
 * - Uses BASE_URL for proper image URL construction
 * 
 * USER INTERACTIONS:
 * - Image viewing with Ant Design Image component (zoom, preview)
 * - Read-only form data display
 * - Disabled input fields showing image descriptions
 * - Responsive layout adapts to different screen sizes
 * 
 * STATE MANAGEMENT:
 * - Stateless component - receives all data via props
 * - Uses allTableDataType interface for type safety
 * - Conditional rendering for images and rejection reasons
 * 
 * IMAGE HANDLING:
 * - Maps through images array to display each image
 * - Constructs full image URLs using BASE_URL + image.url
 * - Fixed height (200px) for consistent layout
 * - Bordered containers for visual separation
 * - Centered alignment for professional appearance
 * 
 * USED BY:
 * - ViewModal: Primary content component for all view modals
 * - CheckerEditModal: Display form info in edit modals
 * - ManagerEdit: Manager edit modal content
 * - ManagerView: Manager view modal content
 *
 * USAGE:
 * - Primary component for ViewModal content across all roles
 * - Used in form detail views across different roles
 * - Combines multiple helper components for complete form display
 * - Central component that orchestrates MakeInfo, images, and BackReason display
 * 
 * ROLE-BASED ACCESS:
 * - Visible to all roles for form viewing
 * - Critical for checkers reviewing KYC submissions
 * - Helps makers understand rejection feedback
 */

import { Divider, Flex, Input, Image } from "antd";
import { allTableDataType } from "../../MakeForm/AllMakeFormTable";
import { Typography } from "antd";
import MakeInfo from "./MakeInfo";
import BackReason from "./BackReason";
import { BASE_URL } from "../../../services/Constants";

const DisplayInfo = (modal: allTableDataType) => {
  const { Title } = Typography;
  return (
    <Flex vertical gap={"middle"}>
      <MakeInfo {...modal} />
      <Divider />
      <Flex vertical align="center" gap={"middle"}>
        <Title level={3}>Images</Title>
        <Flex gap={"large"} wrap justify="center" align="center">
          {modal.images.length !== 0 ? (
            modal.images.map((image) => {
              return (
                <Flex
                  style={{
                    border: "1px solid #d9d9d9",
                    borderRadius: "5px",
                  }}
                >
                  <Flex
                    vertical
                    gap={"middle"}
                    align="center"
                    style={{ position: "relative" }}
                  >
                    <Image height={200} src={BASE_URL+"/"+image.url} />
                    <Input disabled value={image.description} />
                  </Flex>
                </Flex>
              );
            })
          ) : (
            <p>No images are found</p>
          )}
          <BackReason {...modal} />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default DisplayInfo;
