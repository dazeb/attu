import { FC, useContext, useMemo, useState } from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { rootContext, dataContext } from '@/context';
import DialogTemplate from '@/components/customDialog/DialogTemplate';
import CustomInput from '@/components/customInput/CustomInput';
import { formatForm } from '@/utils';
import { IForm, useFormValidation } from '@/hooks';
import { ITextfieldConfig } from '@/components/customInput/Types';
import { Property } from '@/consts';
import { DatabaseService } from '@/http';
import type { CollectionObject } from '@server/types';
import { CollectionService } from '@/http';

export interface EditPropertyProps {
  target: CollectionObject | string;
  type: 'collection' | 'database';
  property: Property;
  cb?: (target: CollectionObject | string) => void;
}

const EditPropertyDialog: FC<EditPropertyProps> = props => {
  const { fetchCollection } = useContext(dataContext);
  const { handleCloseDialog } = useContext(rootContext);

  const { cb, target, property } = props;
  const [form, setForm] = useState<IForm>({
    key: 'property',
    value: property.value,
  });

  const checkedForm = useMemo(() => {
    return formatForm(form);
  }, [form]);

  const { validation, checkIsValid, disabled } = useFormValidation(checkedForm);

  const { t: dialogTrans } = useTranslation('dialog');
  const { t: warningTrans } = useTranslation('warning');
  const { t: btnTrans } = useTranslation('btn');

  const handleInputChange = (value: string) => {
    setForm({ ...form, key: 'property', value });
  };

  const handleConfirm = async () => {
    let value: unknown = '';

    if (form.value !== '') {
      switch (property.type) {
        case 'number':
          value = Number(form.value);
          break;
        case 'boolean':
          value = form.value === 'true';
          break;
        default:
          value = form.value;
      }
    }

    switch (props.type) {
      case 'collection':
        await CollectionService.setProperty(
          (target as CollectionObject).collection_name,
          { [property.key]: value }
        );
        await fetchCollection((target as CollectionObject).collection_name);
        break;
      case 'database':
        await DatabaseService.setProperty({
          db_name: target as string,
          properties: { [property.key]: value },
        });
        break;
    }

    handleCloseDialog();
    cb && (await cb(target));
  };

  const propertyInputConfig: ITextfieldConfig = {
    label: dialogTrans('value'),
    key: 'value',
    onChange: handleInputChange,
    variant: 'filled',
    placeholder: '',
    fullWidth: true,
    validations: [
      {
        rule: property.type === 'number' ? 'number' : 'bool',
        errorText:
          property.type === 'number'
            ? warningTrans('integer', { name: dialogTrans('value') })
            : warningTrans('bool', { name: dialogTrans('value') }),
      },
    ],
    defaultValue: form.value,
  };

  return (
    <DialogTemplate
      title={dialogTrans('editPropertyTitle', { type: props.type })}
      handleClose={handleCloseDialog}
      children={
        <>
          <Typography
            variant="body1"
            component="p"
            sx={{ margin: '8px 0 16px 0' }} // 用 sx 替代 className
          >
            <code>
              <b>{property.key}</b>
            </code>
          </Typography>
          <CustomInput
            type="text"
            textConfig={propertyInputConfig}
            checkValid={checkIsValid}
            validInfo={validation}
          />
        </>
      }
      confirmLabel={btnTrans('confirm')}
      handleConfirm={handleConfirm}
      confirmDisabled={disabled}
    />
  );
};

export default EditPropertyDialog;
