import { FC, useContext, useMemo, useState } from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { rootContext, dataContext } from '@/context';
import DialogTemplate from '@/components/customDialog/DialogTemplate';
import CustomInput from '@/components/customInput/CustomInput';
import { formatForm } from '@/utils';
import { useFormValidation } from '@/hooks';
import type { ITextfieldConfig } from '@/components/customInput/Types';
import type { CollectionObject } from '@server/types';
import { CollectionService } from '@/http';

export interface CreateAliasProps {
  collection: CollectionObject;
  cb?: (collection: CollectionObject) => void;
}

const CreateAliasDialog: FC<CreateAliasProps> = props => {
  const { fetchCollection } = useContext(dataContext);
  const { handleCloseDialog } = useContext(rootContext);

  const { cb, collection } = props;
  const [form, setForm] = useState({
    alias: '',
  });

  const checkedForm = useMemo(() => {
    const { alias } = form;
    return formatForm({ alias });
  }, [form]);

  const { validation, checkIsValid, disabled } = useFormValidation(checkedForm);

  const { t: dialogTrans } = useTranslation('dialog');
  const { t: warningTrans } = useTranslation('warning');
  const { t: collectionTrans } = useTranslation('collection');
  const { t: btnTrans } = useTranslation('btn');

  const handleInputChange = (value: string) => {
    setForm({ alias: value });
  };

  const handleConfirm = async () => {
    await CollectionService.createAlias(collection.collection_name, form.alias);
    await fetchCollection(collection.collection_name);
    handleCloseDialog();
    cb && (await cb(collection));
  };

  const aliasInputConfig: ITextfieldConfig = {
    label: collectionTrans('alias'),
    key: 'alias',
    onChange: handleInputChange,
    variant: 'filled',
    placeholder: collectionTrans('aliasCreatePlaceholder'),
    fullWidth: true,
    validations: [
      {
        rule: 'require',
        errorText: warningTrans('required', {
          name: collectionTrans('name'),
        }),
      },
      {
        rule: 'collectionName',
        errorText: collectionTrans('nameContentWarning'),
      },
    ],
    defaultValue: form.alias,
  };
  return (
    <DialogTemplate
      title={dialogTrans('createAlias', {
        type: collection.collection_name,
      })}
      handleClose={handleCloseDialog}
      children={
        <>
          <Typography
            variant="body1"
            component="p"
            sx={{ margin: '8px 0 16px 0' }}
          >
            {collectionTrans('aliasInfo')}
          </Typography>
          <CustomInput
            type="text"
            textConfig={aliasInputConfig}
            checkValid={checkIsValid}
            validInfo={validation}
          />
        </>
      }
      confirmLabel={btnTrans('create')}
      handleConfirm={handleConfirm}
      confirmDisabled={disabled}
    />
  );
};

export default CreateAliasDialog;
