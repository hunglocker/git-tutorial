import { useForm } from 'react-hook-form';
import { FormField, Input } from '@/components/ui/FormField';
import Button from '@/components/ui/Button';
import type { Customer, CreateCustomerRequest } from '@/types';
import styles from './CustomerForm.module.css';

interface CustomerFormValues {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  identityNumber: string;
}

interface CustomerFormProps {
  defaultValues?: Customer;
  onSubmit: (data: CreateCustomerRequest) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function CustomerForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
}: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    defaultValues: {
      fullName: defaultValues?.fullName ?? '',
      phone: defaultValues?.phone ?? '',
      email: defaultValues?.email ?? '',
      address: defaultValues?.address ?? '',
      identityNumber: defaultValues?.identityNumber ?? '',
    },
  });

  const handleFormSubmit = (values: CustomerFormValues) => {
    onSubmit({
      fullName: values.fullName.trim(),
      phone: values.phone.trim(),
      email: values.email.trim() || null,
      address: values.address.trim() || null,
      identityNumber: values.identityNumber.trim() || null,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div className={styles.fields}>
        <div className={styles.row}>
          <FormField
            label="Họ và tên"
            error={errors.fullName?.message}
            required
            htmlFor="customer-name"
          >
            <Input
              id="customer-name"
              hasError={!!errors.fullName}
              placeholder="Nhập họ và tên"
              {...register('fullName', {
                required: 'Họ và tên là bắt buộc.',
                maxLength: { value: 200, message: 'Tối đa 200 ký tự.' },
              })}
            />
          </FormField>

          <FormField
            label="Số điện thoại"
            error={errors.phone?.message}
            required
            htmlFor="customer-phone"
          >
            <Input
              id="customer-phone"
              type="tel"
              hasError={!!errors.phone}
              placeholder="VD: 0901234567"
              {...register('phone', {
                required: 'Số điện thoại là bắt buộc.',
                maxLength: { value: 20, message: 'Tối đa 20 ký tự.' },
              })}
            />
          </FormField>
        </div>

        <div className={styles.row}>
          <FormField
            label="Email"
            error={errors.email?.message}
            htmlFor="customer-email"
          >
            <Input
              id="customer-email"
              type="email"
              placeholder="email@example.com (tùy chọn)"
              {...register('email', {
                maxLength: { value: 256, message: 'Tối đa 256 ký tự.' },
              })}
            />
          </FormField>

          <FormField
            label="CMND / CCCD"
            htmlFor="customer-identity"
          >
            <Input
              id="customer-identity"
              placeholder="Số CMND / CCCD (tùy chọn)"
              {...register('identityNumber')}
            />
          </FormField>
        </div>

        <FormField
          label="Địa chỉ"
          htmlFor="customer-address"
        >
          <Input
            id="customer-address"
            placeholder="Địa chỉ (tùy chọn)"
            {...register('address')}
          />
        </FormField>
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {defaultValues ? 'Cập nhật' : 'Tạo mới'}
        </Button>
      </div>
    </form>
  );
}
