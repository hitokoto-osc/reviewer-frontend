import { Button as AButton, Table as ATable } from 'ant-design-vue'
import { TableColumnType } from 'ant-design-vue'

// 标签相关
const formatMarkColor = (level: string) => {
  switch (level) {
    case 'danger':
      return 'red'
    case 'warning':
      return 'orange'
    case 'info':
      return 'blue'
    default:
      return 'gray'
  }
}
const formatMarkLabel = (level: string) => {
  switch (level) {
    case 'danger':
      return '严重'
    case 'warning':
      return '警告'
    case 'info':
      return '提示'
    default:
      return '未知'
  }
}

// 类别相关
const formatMarkProperty = (property: number) => {
  switch (property.toString()) {
    case '1':
      return '赞同'
    case '2':
      return '驳回'
    case '3':
      return '需要修改'
    default:
      return '未知'
  }
}

export default defineComponent({
  setup() {
    const { pending, data } = usePollMarks()
    const dataSource = computed(() => {
      return data.value?.data || []
    })
    // Actions 相关
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const doDeprecated = async (record: PollMarkRes['0']) => {
      // do deprecated
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const editMark = async (record: PollMarkRes['0']) => {}

    const cols = [
      {
        title: '#',
        dataIndex: 'id',
        // sorter: true,
        align: 'center',
        width: '40px'
      },
      {
        title: '标签',
        dataIndex: 'text',
        align: 'center'

        // sorter: true,
        // width: '20%',
      },
      {
        title: '程度',
        dataIndex: 'level',
        align: 'center',
        customRender: ({ text }) => {
          return h(
            <a-tag color={formatMarkColor(text)}>{formatMarkLabel(text)}</a-tag>
          )
        }
        // sorter: true,
        // width: '20%'
      },
      {
        title: '类别',
        dataIndex: 'property',
        align: 'center',
        customRender: ({ text }) => {
          return h(<span>{formatMarkProperty(text)}</span>)
        }
        // sorter: true,
        // width: '20%'
      },
      {
        title: '弃用时间',
        dataIndex: 'deprecated_at',
        align: 'center',
        customRender: ({ text }) => {
          return h(<span>{text ? formatDateTime(text) : '未弃用'}</span>)
        }
        // sorter: true,
        // width: '20%'
      },
      {
        title: '更新时间',
        dataIndex: 'updated_at',
        align: 'center',
        customRender: ({ text }) => {
          return h(<span>{formatDateTime(text)}</span>)
        }
        // sorter: true,
        // width: '20%'
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        align: 'center',
        customRender: ({ text }) => {
          return h(<span>{formatDateTime(text)}</span>)
        }
        // sorter: true,
        // width: '20%'
      },
      {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        customRender: ({ record }) => {
          return h(
            <>
              <AButton
                type="text"
                size="small"
                onClick={() => editMark(record)}
              >
                修改
              </AButton>
              <AButton
                type="text"
                size="small"
                onClick={() => doDeprecated(record)}
              >
                弃用
              </AButton>
            </>
          )
        }
        // sorter: true,
        // width: '20%'
      }
    ] as TableColumnType[]
    return () => (
      <div class=":uno: bg-white px-8 py-6 rounded-xl">
        <h1 class="text-2xl pt-0 mt-0">标记管理</h1>
        <div class=":uno: py-2 mb-4 flex justify-end">
          <AButton
            type="primary"
            class=":uno: !inline-flex items-center justify-center"
            shape="round"
          >
            {{
              default: () => '新建标签',
              icon: () => (
                <div class=":uno: i-solar-add-circle-linear inline-block w-4.5 h-4.5 mr-2" />
              )
            }}
          </AButton>
        </div>
        <ATable
          columns={cols}
          rowKey={(record: PollMarkRes['0']) => record.id}
          data-source={dataSource.value}
          loading={pending.value}
        />
      </div>
    )
  }
})
