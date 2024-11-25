import React from 'react'
import { observer } from "mobx-react-lite";
import {Switch, SwitchProps} from "@nextui-org/switch";

const MSwitch = observer((props: SwitchProps) => {
  return (
    <Switch
      classNames={{
        base: "flex-row-reverse gap-2.5",
        wrapper: "bg-background border border-white/10",
        label: "text-primary text-sm",
        thumb: "bg-primary group-data-[selected]:bg-white",
      }}
      {...props} />
  )
});

export default MSwitch
