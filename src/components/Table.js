import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
} from "@material-ui/core";

export default function CustomTable(props) {
  let { headCells = [], bodyCells = [], excludeFields = [] } = props;

  if (bodyCells.length > 0 && headCells.length === 0) {
    headCells = [...Object.keys(bodyCells[0])];
  }

  return (
    <TableContainer>
      <Table>
        <CustomHead headCells={headCells} excludeFields={excludeFields} />
        <CustomBody bodyCells={bodyCells} excludeFields={excludeFields} />
      </Table>
    </TableContainer>
  );
}

function CustomHead(props) {
  let { headCells = [], excludeFields = [] } = props;

  headCells = headCells.filter((field) => !excludeFields.includes(field));
  return (
    <TableHead>
      <TableRow>
        {headCells.map((value, index) => {
          return <TableCell key={index}>{value}</TableCell>;
        })}
      </TableRow>
    </TableHead>
  );
}

function CustomBody(props) {
  const { bodyCells = [], excludeFields = [] } = props;

  return (
    <TableBody>
      {bodyCells.map((obj, index) => {
        return (
          <TableRow hover role="checkbox" tabIndex={-1} key={index}>
            {[...Object.entries(obj)].map((item) => {
              const [key, value] = item;
              if (excludeFields.includes(key)) return false;
              return (
                <TableCell padding="checkbox" key={`${key}-index-${index}`}>
                  {value}
                </TableCell>
              );
            })}
          </TableRow>
        );
      })}
    </TableBody>
  );
}
