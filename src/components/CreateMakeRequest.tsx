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
