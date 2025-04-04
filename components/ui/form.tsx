// components/ui/form.tsx
import * as React from "react";
import { useFormContext, useForm, Controller, FormProvider } from "react-hook-form"; // Import FormProvider and Controller

import { cn } from "@/lib/utils";

interface FormProps extends React.HTMLAttributes<HTMLFormElement> {
  form: ReturnType<typeof useForm>;
}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ form, className, children, ...props }, ref) => {
    return (
      <FormProvider {...form}>
        <form
          ref={ref}
          className={cn(className)}
          {...props}
          onSubmit={(e) => e.preventDefault()}
        >
          {children}
        </form>
      </FormProvider>
    );
  }
);

Form.displayName = "Form";

interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("grid gap-1.5", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FormItem.displayName = "FormItem";

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
        {...props}
      >
        {children}
      </label>
    );
  }
);

FormLabel.displayName = "FormLabel";

interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FormControl.displayName = "FormControl";

interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const FormDescription = React.forwardRef<HTMLParagraphElement, FormDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);

FormDescription.displayName = "FormDescription";

interface FormMessageProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormMessage = React.forwardRef<HTMLDivElement, FormMessageProps>(
  ({ className, children, ...props }, ref) => {
    const formContext = useFormContext();
    const { formState } = formContext || {};
    const { errors } = formState || {};

    if (!formContext) {
      return (
        <div
          ref={ref}
          className={cn("text-sm text-destructive", className)}
          {...props}
        >
          {children}
        </div>
      );
    }

    const error = errors && children;

    return (
      <div
        ref={ref}
        className={cn("text-sm text-destructive", className)}
        {...props}
      >
        {error ? error.toString() : children}
      </div>
    );
  }
);

FormMessage.displayName = "FormMessage";

interface FormFieldProps<T extends object, K extends keyof T>
  extends React.HTMLAttributes<HTMLDivElement> {
  control: ReturnType<typeof useForm>["control"];
  name: K & string;
  render: (
    field: {
      onChange: (...event: any[]) => void;
      onBlur: () => void;
      value: any;
      name: string;
      ref: React.Ref<any>;
    }
  ) => React.ReactNode;
}

const FormField = <T extends object, K extends keyof T>({
  control,
  name,
  render,
  ...props
}: FormFieldProps<T, K>) => {
  return (
    <div {...props}>
      <Controller
        control={control}
        name={name as string}
        render={({ field }) => render(field)}
      />
    </div>
  );
};

FormField.displayName = "FormField";

export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
