import { useForm } from 'react-hook-form';
import { FormField, Input, Select } from '@/components/ui/FormField';
import Button from '@/components/ui/Button';
import { useActiveCategories } from '@/hooks/useCategories';
import type { Product, CreateProductRequest } from '@/types';
import styles from './ProductForm.module.css';

interface ProductFormValues {
  code: string;
  name: string;
  dailyRentalPrice: string;
  categoryId: string;
  description: string;
}

interface ProductFormProps {
  defaultValues?: Product;
  onSubmit: (data: CreateProductRequest) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function ProductForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
}: ProductFormProps) {
  const { data: categories } = useActiveCategories();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: {
      code: defaultValues?.code ?? '',
      name: defaultValues?.name ?? '',
      dailyRentalPrice: defaultValues?.dailyRentalPrice.toString() ?? '',
      categoryId: defaultValues?.categoryId ?? '',
      description: defaultValues?.description ?? '',
    },
  });

  const handleFormSubmit = (values: ProductFormValues) => {
    onSubmit({
      code: values.code.trim(),
      name: values.name.trim(),
      dailyRentalPrice: parseFloat(values.dailyRentalPrice),
      categoryId: values.categoryId,
      description: values.description.trim() || null,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div className={styles.fields}>
        <div className={styles.row}>
          <FormField
            label="Mã sản phẩm"
            error={errors.code?.message}
            required
            htmlFor="product-code"
          >
            <Input
              id="product-code"
              hasError={!!errors.code}
              placeholder="VD: SP001"
              {...register('code', {
                required: 'Mã sản phẩm là bắt buộc.',
                maxLength: { value: 50, message: 'Tối đa 50 ký tự.' },
              })}
            />
          </FormField>

          <FormField
            label="Tên sản phẩm"
            error={errors.name?.message}
            required
            htmlFor="product-name"
          >
            <Input
              id="product-name"
              hasError={!!errors.name}
              placeholder="Nhập tên sản phẩm"
              {...register('name', {
                required: 'Tên sản phẩm là bắt buộc.',
                maxLength: { value: 200, message: 'Tối đa 200 ký tự.' },
              })}
            />
          </FormField>
        </div>

        <div className={styles.row}>
          <FormField
            label="Giá thuê / ngày (VNĐ)"
            error={errors.dailyRentalPrice?.message}
            required
            htmlFor="product-price"
          >
            <Input
              id="product-price"
              type="number"
              min="0"
              step="1000"
              hasError={!!errors.dailyRentalPrice}
              placeholder="0"
              {...register('dailyRentalPrice', {
                required: 'Giá thuê là bắt buộc.',
                min: { value: 0, message: 'Giá không được âm.' },
              })}
            />
          </FormField>

          <FormField
            label="Danh mục"
            error={errors.categoryId?.message}
            required
            htmlFor="product-category"
          >
            <Select
              id="product-category"
              hasError={!!errors.categoryId}
              {...register('categoryId', {
                required: 'Vui lòng chọn danh mục.',
              })}
            >
              <option value="">-- Chọn danh mục --</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        <FormField
          label="Mô tả"
          htmlFor="product-description"
        >
          <Input
            id="product-description"
            placeholder="Nhập mô tả (tùy chọn)"
            {...register('description')}
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
