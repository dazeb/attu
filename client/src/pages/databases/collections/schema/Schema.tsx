import { Typography, Chip, Tooltip } from '@mui/material';
import { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AttuGrid from '@/components/grid/Grid';
import { ColDefinitionsType } from '@/components/grid/Types';
import { useTranslation } from 'react-i18next';
import Icons from '@/components/icons/Icons';
import { formatFieldType, formatNumber, findKeyValue } from '@/utils';
import { dataContext, rootContext, systemContext } from '@/context';
import IndexTypeElement from './IndexTypeElement';
import { getLabelDisplayedRows } from '@/pages/search/Utils';
import StatusAction from '@/pages/databases/collections/StatusAction';
import CustomToolTip from '@/components/customToolTip/CustomToolTip';
import { useStyles } from './Styles';
import CustomIconButton from '@/components/customButton/CustomIconButton';
import LoadCollectionDialog from '@/pages/dialogs/LoadCollectionDialog';
import RenameCollectionDialog from '@/pages/dialogs/RenameCollectionDialog';
import EditMmapDialog from '@/pages/dialogs/EditMmapDialog';
import DropCollectionDialog from '@/pages/dialogs/DropCollectionDialog';
import CopyButton from '@/components/advancedSearch/CopyButton';
import RefreshButton from '@/components/customButton/RefreshButton';
import { CollectionService } from '@/http';
import type { FieldObject } from '@server/types';

const Overview = () => {
  const { fetchCollection, collections, loading, database } =
    useContext(dataContext);
  const { data } = useContext(systemContext);
  const { setDialog } = useContext(rootContext);

  const { collectionName = '' } = useParams<{ collectionName: string }>();
  const navigate = useNavigate();
  const classes = useStyles();
  const { t: collectionTrans } = useTranslation('collection');
  const { t: indexTrans } = useTranslation('index');
  const { t: btnTrans } = useTranslation('btn');
  const { t: commonTrans } = useTranslation();

  const consistencyTooltipsMap: Record<string, string> = {
    Strong: collectionTrans('consistencyStrongTooltip'),
    Bounded: collectionTrans('consistencyBoundedTooltip'),
    Session: collectionTrans('consistencySessionTooltip'),
    Eventually: collectionTrans('consistencyEventuallyTooltip'),
  };

  // get collection
  const collection = collections.find(
    c => c.collection_name === collectionName
  );

  // fetch collection if not loaded
  if (collection && !collection.schema) {
    fetchCollection(collectionName);
  }

  // get fields
  const fields = collection?.schema?.fields || [];

  const colDefinitions: ColDefinitionsType[] = [
    {
      id: 'name',
      align: 'left',
      disablePadding: true,
      formatter(f: FieldObject) {
        return (
          <div className={classes.nameWrapper}>
            {f.name}
            {f.is_primary_key ? (
              <div
                className={classes.primaryKeyChip}
                title={collectionTrans('idFieldName')}
              >
                <Chip className={classes.chip} size="small" label="ID" />
              </div>
            ) : null}
            {f.is_partition_key ? (
              <Chip
                className={classes.chip}
                size="small"
                label="Partition key"
              />
            ) : null}
            {findKeyValue(f.type_params, 'enable_match') ? (
              <Chip
                className={classes.chip}
                size="small"
                label={collectionTrans('enableMatch')}
              />
            ) : null}
            {findKeyValue(f.type_params, 'enable_analyzer') === 'true' ? (
              <Tooltip
                title={findKeyValue(f.type_params, 'analyzer_params') as string}
                arrow
              >
                <Chip
                  className={classes.chip}
                  size="small"
                  label={collectionTrans('analyzer')}
                  onClick={() => {
                    const textToCopy = findKeyValue(
                      f.type_params,
                      'analyzer_params'
                    );
                    navigator.clipboard
                      .writeText(textToCopy as string)
                      .then(() => {
                        alert('Copied to clipboard!');
                      })
                      .catch(err => {
                        alert('Failed to copy: ' + err);
                      });
                  }}
                />
              </Tooltip>
            ) : null}
            {findKeyValue(f.type_params, 'mmap.enabled') === 'true' ||
            isCollectionMmapEnabled ? (
              <Tooltip title={collectionTrans('mmapTooltip')} arrow>
                <Chip
                  className={classes.chip}
                  size="small"
                  label={collectionTrans('mmapEnabled')}
                  onClick={() => {
                    setDialog({
                      open: true,
                      type: 'custom',
                      params: {
                        component: (
                          <EditMmapDialog
                            collection={collection!}
                            cb={async () => {
                              fetchCollection(collectionName);
                            }}
                          />
                        ),
                      },
                    });
                  }}
                />
              </Tooltip>
            ) : null}

            {f.function ? (
              <Tooltip title={JSON.stringify(f.function)} arrow>
                <Chip
                  className={classes.chip}
                  size="small"
                  label={`
                    ${
                      f.is_function_output
                        ? `<- ${f.function.type}(${f.function.input_field_names})`
                        : ` ${collectionTrans('function')}: ${f.function.type}`
                    }`}
                  onClick={() => {
                    const textToCopy = JSON.stringify(f.function);
                    navigator.clipboard
                      .writeText(textToCopy as string)
                      .then(() => {
                        alert('Copied to clipboard!');
                      })
                      .catch(err => {
                        alert('Failed to copy: ' + err);
                      });
                  }}
                />
              </Tooltip>
            ) : null}
          </div>
        );
      },
      label: collectionTrans('fieldName'),
      sortBy: 'name',
    },
    {
      id: 'data_type',
      align: 'left',
      disablePadding: false,
      formatter(f) {
        return (
          <Chip
            className={`${classes.chip} ${classes.dataTypeChip}`}
            size="small"
            label={formatFieldType(f)}
          />
        );
      },
      label: collectionTrans('fieldType'),
    },
    {
      id: 'nullable',
      align: 'left',
      disablePadding: false,
      label: collectionTrans('nullable'),
      formatter(f) {
        return f.nullable ? (
          <Icons.check className={classes.smallIcon} />
        ) : (
          <Icons.cross2 className={classes.smallIcon} />
        );
      },
    },
    {
      id: 'default_value',
      align: 'left',
      disablePadding: false,
      label: collectionTrans('defaultValue'),
      formatter(f) {
        return f.default_value || '--';
      },
    },
    {
      id: 'name',
      align: 'left',
      disablePadding: true,
      label: indexTrans('indexName'),
      formatter(f) {
        return f.index?.index_name;
      },
    },
    {
      id: 'name',
      align: 'left',
      disablePadding: true,
      label: indexTrans('type'),
      notSort: true,
      formatter(f) {
        return (
          <IndexTypeElement
            field={f}
            collectionName={collectionName}
            cb={async () => {
              await fetchCollection(collectionName);
            }}
          />
        );
      },
    },
    {
      id: 'name',
      align: 'left',
      disablePadding: false,
      label: indexTrans('param'),
      notSort: true,
      formatter(f) {
        return f.index ? (
          <div className={classes.paramWrapper}>
            {f.index.indexParameterPairs.length > 0 ? (
              f.index.indexParameterPairs.map((p: any) =>
                p.value ? (
                  <div key={p.key + p.value}>
                    <span className="param">
                      <Typography variant="body1" className="key">
                        {`${p.key}:`}
                      </Typography>
                      <Typography variant="body1" className="value">
                        {p.value}
                      </Typography>
                    </span>
                  </div>
                ) : (
                  ''
                )
              )
            ) : (
              <>--</>
            )}
          </div>
        ) : (
          <>--</>
        );
      },
    },
    {
      id: 'description',
      align: 'left',
      disablePadding: false,
      label: indexTrans('desc'),
    },
  ];

  // only show create index element when there is only one vector field
  let CreateIndexElement = null;
  if (
    collection &&
    collection.schema &&
    collection.schema.vectorFields.length === 1
  ) {
    CreateIndexElement = (
      <IndexTypeElement
        field={
          (collection.schema && collection.schema.vectorFields[0]) ||
          ({} as FieldObject)
        }
        collectionName={collectionName}
        cb={async () => {
          await fetchCollection(collectionName);
        }}
      />
    );
  }

  // enable modify replica if there are more than one query node
  const enableModifyReplica =
    data && data.queryNodes && data.queryNodes.length > 1;

  // if is autoID enabled
  const isAutoIDEnabled = collection?.schema?.fields.some(
    f => f.autoID === true
  );

  // check if collection is mmap enabled
  const isCollectionMmapEnabled = collection?.properties?.some((p: any) => {
    return p.key === 'mmap.enabled' && p.value === 'true';
  });

  // get loading state label
  return (
    <section className={classes.wrapper}>
      {collection && (
        <section className={classes.infoWrapper}>
          <div className={classes.cardWrapper}>
            <div className={classes.card}>
              <Typography variant="h5">{collectionTrans('name')}</Typography>
              <Typography variant="h6">
                <p title={collection.collection_name}>
                  {collection.collection_name}
                </p>
                <RefreshButton
                  className={classes.extraBtn}
                  onClick={async () => {
                    setDialog({
                      open: true,
                      type: 'custom',
                      params: {
                        component: (
                          <RenameCollectionDialog
                            collection={collection}
                            cb={async newName => {
                              await fetchCollection(newName);

                              // update collection name in the route url;
                              navigate(
                                `/databases/${database}/${newName}/schema`
                              );
                            }}
                          />
                        ),
                      },
                    });
                  }}
                  tooltip={btnTrans('rename')}
                  icon={<Icons.edit />}
                />
                <CopyButton
                  className={classes.extraBtn}
                  label={collection.collection_name}
                  value={collection.collection_name}
                />
                <RefreshButton
                  className={classes.extraBtn}
                  onClick={async () => {
                    const res =
                      await CollectionService.describeCollectionUnformatted(
                        collection.collection_name
                      );

                    // download json file
                    const json = JSON.stringify(res, null, 2);
                    const blob = new Blob([json], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${collection.collection_name}.json`;
                    a.click();
                  }}
                  tooltip={btnTrans('downloadSchema')}
                  icon={<Icons.download />}
                />
                <CustomIconButton
                  className={classes.extraBtn}
                  tooltip={btnTrans('drop')}
                  onClick={() => {
                    setDialog({
                      open: true,
                      type: 'custom',
                      params: {
                        component: (
                          <DropCollectionDialog
                            collections={[collection]}
                            onDelete={() => {
                              navigate(`/databases/${database}`);
                            }}
                          />
                        ),
                      },
                    });
                  }}
                >
                  <Icons.cross />
                </CustomIconButton>

                <RefreshButton
                  className={classes.extraBtn}
                  tooltip={btnTrans('refresh')}
                  onClick={async () => {
                    await fetchCollection(collectionName);
                  }}
                />
              </Typography>
              <Typography variant="h5">
                {collectionTrans('description')}
              </Typography>
              <Typography variant="h6">
                {collection?.description || '--'}
              </Typography>
              <Typography variant="h5">
                {collectionTrans('createdTime')}
              </Typography>
              <Typography variant="h6">
                {new Date(collection.createdTime).toLocaleString()}
              </Typography>
            </div>

            <div className={classes.card}>
              <Typography variant="h5">{collectionTrans('status')}</Typography>
              <StatusAction
                status={collection.status}
                percentage={collection.loadedPercentage}
                collection={collection}
                showExtraAction={false}
                showLoadButton={true}
                createIndexElement={CreateIndexElement}
              />
              <Typography variant="h5">
                {collectionTrans('replica')}
                <CustomToolTip title={collectionTrans('replicaTooltip')}>
                  <Icons.question classes={{ root: classes.questionIcon }} />
                </CustomToolTip>
              </Typography>
              <Typography variant="h6">
                {collection.loaded ? collection.replicas?.length : '...'}
                {collection.loaded && enableModifyReplica && (
                  <CustomIconButton
                    className={classes.extraBtn}
                    tooltip={collectionTrans('modifyReplicaTooltip')}
                    onClick={() => {
                      setDialog({
                        open: true,
                        type: 'custom',
                        params: {
                          component: (
                            <LoadCollectionDialog
                              collection={collection}
                              isModifyReplica={true}
                            />
                          ),
                        },
                      });
                    }}
                  >
                    <Icons.settings />
                  </CustomIconButton>
                )}
              </Typography>

              <Typography variant="h5">
                {collection.loaded ? (
                  collectionTrans('count')
                ) : (
                  <>
                    {collectionTrans('rowCount')}
                    <CustomToolTip title={collectionTrans('entityCountInfo')}>
                      <Icons.question
                        classes={{ root: classes.questionIcon }}
                      />
                    </CustomToolTip>
                  </>
                )}
              </Typography>
              <Typography variant="h6">
                {formatNumber(Number(collection?.rowCount || '0'))}
              </Typography>
            </div>
            <div className={classes.card}>
              <Typography variant="h5">
                {collectionTrans('features')}
              </Typography>
              {isAutoIDEnabled ? (
                <Chip
                  className={`${classes.chip} ${classes.featureChip}`}
                  label={collectionTrans('autoId')}
                  size="small"
                />
              ) : null}
              <Tooltip
                title={
                  consistencyTooltipsMap[collection.consistency_level!] || ''
                }
                placement="top"
                arrow
              >
                <Chip
                  className={`${classes.chip} ${classes.featureChip}`}
                  label={`${collectionTrans('consistency')}: ${
                    collection.consistency_level
                  }`}
                  size="small"
                />
              </Tooltip>

              {collection &&
              collection.schema &&
              collection.schema.enable_dynamic_field ? (
                <Tooltip
                  title={collectionTrans('dynamicSchemaTooltip')}
                  placement="top"
                  arrow
                >
                  <Chip
                    className={`${classes.chip}`}
                    label={collectionTrans('dynamicSchema')}
                    size="small"
                  />
                </Tooltip>
              ) : null}

              <Tooltip
                title={collectionTrans('mmapTooltip')}
                placement="top"
                arrow
              >
                <Chip
                  className={classes.chip}
                  label={collectionTrans('mmapSettings')}
                  size="small"
                  onDelete={async () => {
                    setDialog({
                      open: true,
                      type: 'custom',
                      params: {
                        component: (
                          <EditMmapDialog
                            collection={collection}
                            cb={async () => {
                              fetchCollection(collectionName);
                            }}
                          />
                        ),
                      },
                    });
                  }}
                  deleteIcon={<Icons.settings />}
                />
              </Tooltip>
            </div>
          </div>
        </section>
      )}

      <section className={classes.gridWrapper}>
        {/* <Typography variant="h5">{collectionTrans('schema')}</Typography> */}

        <AttuGrid
          toolbarConfigs={[]}
          colDefinitions={colDefinitions}
          rows={fields}
          rowCount={fields.length}
          primaryKey="fieldID"
          showHoverStyle={false}
          isLoading={loading}
          openCheckBox={false}
          showPagination={false}
          labelDisplayedRows={getLabelDisplayedRows(
            commonTrans(`grid.${fields.length > 1 ? 'fields' : 'field'}`)
          )}
        />
      </section>
    </section>
  );
};

export default Overview;
