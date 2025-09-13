/**
 * CREATE MAKE REQUEST COMPONENT
 * 
 * PURPOSE:
 * Modal component for creating new KYC make requests. Currently serves as a placeholder
 * modal with basic structure but no active functionality implemented.
 * 
 * FUNCTIONALITY:
 * - Modal display with title "Create a make Request"
 * - Hidden OK and Cancel buttons (display: none)
 * - Modal close handling via onCancel prop
 * - Empty modal body - prepared for future form implementation
 * 
 * PROPS:
 * - open: boolean - Controls modal visibility state
 * - setOpen: React state setter - Function to update modal open state
 * 
 * USER INTERACTIONS:
 * - Modal can be closed by clicking outside or using close button
 * - No form interactions currently implemented
 * 
 * STATE MANAGEMENT:
 * - Modal open/close state managed by parent component
 * - No internal state management
 * 
 * USAGE: Placeholder modal component for future KYC request creation functionality
 */

import { Modal } from 'antd'
import React from 'react'

interface CreateMakeRequestInterface{
    open:boolean;
    setOpen:React.Dispatch<React.SetStateAction<boolean>>;
    
}
const CreateMakeRequest = (prop:CreateMakeRequestInterface) => {
  return (
    <Modal
    title="Create a make Request"
    okButtonProps={{style:{display:"none"}}}
    cancelButtonProps={{style:{display:"none"}}}
    onCancel={()=>prop.setOpen(false)}
    >

    </Modal>
  )
}

export default CreateMakeRequest
