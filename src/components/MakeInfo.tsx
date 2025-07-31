import { Divider, Flex } from 'antd'
import { allTableDataType } from './MakeFormTable'
import { ExtractDate } from '../services/DisplayFunctions'

const MakeInfo = (modal:allTableDataType) => {
  return (
    <Flex justify="space-between">
      <Flex vertical style={{ width: "40%" }}>
        <Flex justify="space-between">
          <p>
            <strong>CIF:</strong>
          </p>
          <p>{modal!.cif}</p>
        </Flex>
        <Divider />
        <p>
          <strong>Customer Info</strong>
        </p>
        <Flex justify="space-between">
          <p>Name:</p>
          <p>{modal!.customerName}</p>
        </Flex>
        <Flex justify="space-between">
          <p>Account:</p>
          <p>{modal!.customerAccount}</p>
        </Flex>
        <Flex justify="space-between">
          <p>Phone:</p>
          <p>{modal!.customerPhone}</p>
        </Flex>
      </Flex>

      <Flex vertical style={{ width: "40%" }}>
        <p>
          <strong>Request Info</strong>
        </p>
        <Flex justify="space-between">
          <p>Maker ID:</p>
          <p>{modal!.makerId}</p>
        </Flex>
        <Flex justify="space-between">
          <p>Made At:</p>
          <p>{ExtractDate(modal!.madeAt)}</p>
        </Flex>

        <Divider />

        <p>
          <strong>Checker Info</strong>
        </p>
        <Flex justify="space-between">
          <p>Checker ID:</p>
          <p>{modal?.hoId || "No checker assigned"}</p>
        </Flex>
        <Flex justify="space-between">
          <p>Assigned At:</p>
          <p>{modal?.assignedAt ? ExtractDate(modal!.assignedAt) : "-"}</p>
        </Flex>
        <Flex justify="space-between">
          <p>Validated At:</p>
          <p>
            {modal?.checkedAt
              ? ExtractDate(modal!.checkedAt)
              : "Not checked yet"}
          </p>
        </Flex>
        <Flex justify="space-between">
          <p>
            <strong>Status:</strong>
          </p>
          <p>
            {modal!.status === 0
              ? "Pending"
              : modal!.status === 1
              ? "Approved"
              : "Rejected"}
          </p>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default MakeInfo
