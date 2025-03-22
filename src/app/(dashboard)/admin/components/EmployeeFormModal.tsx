'use client'

import { createOrUpdateEmployee } from '@/actions/admin.actions'
import Modal from '@/components/forms/modal/Modal'
import { showToast } from '@/lib/toast'
import { Employee, EmployeeSchema } from '@/schemas/employee.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm, Controller, Control } from 'react-hook-form'

interface Props {
  isOpen: boolean
  employee?: Employee | null
  onClose: () => void
  showRole?: boolean
}

const EmployeeFormModal = ({ isOpen, employee, onClose, showRole = true }: Props) => {
  const isEditMode = !!employee
  const title = showRole 
    ? isEditMode 
        ? 'Editar empleado' 
        : 'Agregar nuevo empleado' 
    : isEditMode 
        ? 'Editar doctor' 
        : 'Agregar nuevo doctor';

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch
  } = useForm<Employee>({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: {
      nombre: employee?.nombre ?? '',
      apellido: employee?.apellido ?? '',
      dni: employee?.dni ?? '',
      password: employee?.password ?? '',
      sexo: employee?.sexo ?? 'MASCULINO',
      email: employee?.email ?? '',
      telefono: employee?.telefono ?? '',
      direccion: employee?.direccion ?? '',
      especialidad: employee?.especialidad ?? '',
      roles: !showRole ? ['ODONTOLOGO'] : employee?.roles ?? [],
    },
  })

  const roles = watch('roles')

  useEffect(() => {
    if (!showRole && roles.length === 0) setValue('roles', ['ODONTOLOGO'])
  }, [showRole, setValue])


  const onSubmit = async (data: Employee) => {
    const response = await createOrUpdateEmployee(data)

    if (!response.success) {
      showToast('error', response.error)
      return
    }

    showToast('success', response.message)
    onClose()
  }

  return (
    <Modal
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      primaryButtonTitle={isEditMode ? 'Actualizar' : 'Agregar'}
    >
      <form className="space-y-6 py-4">
        <div className="grid grid-cols-2 gap-4">
          <InputField label="Nombre" id="nombre" register={register} error={errors.nombre} />
          <InputField label="Apellido" id="apellido" register={register} error={errors.apellido} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputField label="DNI" id="dni" register={register} error={errors.dni} />
          <InputField label="Contraseña" id="password" register={register} error={errors.password} type="password" />
        </div>

        <InputField label="Email" id="email" register={register} error={errors.email} type="email" />

        <div className="grid grid-cols-2 gap-4">
          <InputField label="Teléfono" id="telefono" register={register} error={errors.telefono} />
          <InputField label="Dirección" id="direccion" register={register} error={errors.direccion} />
        </div>

        <InputField label="Especialidad" id="especialidad" register={register} error={errors.especialidad} />

        <div className={`grid gap-4 ${!showRole ? 'grid-cols-1' : 'grid-cols-2'}`}>
          <SelectField
            label="Sexo"
            id="sexo"
            error={errors.sexo}
            options={[
              { value: 'MASCULINO', label: 'Masculino' },
              { value: 'FEMENINO', label: 'Femenino' },
            ]}
            control={control}
          />

          {
            showRole && (
              <SelectField
                label="Rol"
                id="roles"
                multiple
                error={errors.roles as FieldError}
                options={[
                  { value: 'ODONTOLOGO', label: 'Odontólogo' },
                  { value: 'RECEPCIONISTA', label: 'Recepcionista' },
                ]}
                control={control}
              />
            )
          }
        </div>
      </form>
    </Modal>
  )
}

export default EmployeeFormModal

import { FieldError, UseFormRegister } from "react-hook-form";

interface InputFieldProps {
  label?: string;
  id: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label = "",
  id,
  register,
  error,
  type = "text",
}) => (
  <div className="flex flex-col">
    <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      {...register(id)}
      type={type}
      id={id}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      aria-invalid={error ? "true" : "false"}
    />
    {error && <span className="text-red-500 text-xs mt-1">{error.message}</span>}
  </div>
);

interface SelectFieldProps {
  label: string;
  id: string;
  error?: FieldError;
  options: { value: string; label: string }[];
  multiple?: boolean;
  control: Control<any>;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  id,
  error,
  options,
  multiple = false,
  control,
}) => (
  <div className="flex flex-col">
    <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <Controller
      name={id}
      control={control}
      render={({ field }) => (
        <select
          {...field}
          id={id}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          multiple={multiple}
          onChange={(e) => {
            if (multiple) {
              const values = Array.from(e.target.selectedOptions, (option) => option.value);
              field.onChange(values);
            } else {
              field.onChange(e.target.value);
            }
          }}
          value={multiple ? field.value || [] : field.value || ""}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    />
    {error && <span className="text-red-500 text-xs mt-1">{error.message}</span>}
  </div>
);

