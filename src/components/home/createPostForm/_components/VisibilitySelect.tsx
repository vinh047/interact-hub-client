import { type Control } from "react-hook-form";
import { FormField, FormControl } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VISIBILITY_MAP } from "@/constants/post.constants";
import { type CreatePostRequest } from "@/types/post.type";

export function VisibilitySelect({
  control,
}: {
  control: Control<CreatePostRequest>;
}) {
  return (
    <FormField
      control={control}
      name="visibility"
      render={({ field }) => (
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger className="h-7 w-fit bg-gray-100 border-none hover:bg-gray-200 text-[12px] font-bold px-2.5 py-0 gap-1.5 rounded-md text-gray-700 focus:ring-0">
              <SelectValue />
            </SelectTrigger>
          </FormControl>
          <SelectContent className="rounded-xl border-gray-200 shadow-xl min-w-45">
            <div className="px-3 py-2 text-[12px] font-bold text-gray-400 uppercase tracking-wider">
              Quyền xem
            </div>
            {Object.entries(VISIBILITY_MAP).map(
              ([value, { label, icon: Icon }]) => (
                <SelectItem
                  key={value}
                  value={value}
                  className="rounded-lg cursor-pointer py-2 px-3"
                >
                  <div className="flex items-center gap-2.5 font-bold text-[14px] text-gray-700">
                    <Icon size={16} strokeWidth={2.5} />
                    {label}
                  </div>
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      )}
    />
  );
}
