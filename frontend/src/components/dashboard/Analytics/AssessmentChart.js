import {
    Card,
    CardContent,
    Typography,
} from "@mui/material";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from "recharts";

import analyticsDummyData from "./analyticsDummyData";

const COLORS = [
    "#1976d2",
    "#2e7d32",
    "#ed6c02",
    "#d32f2f",
];

const AssessmentChart = () => {

    return (

        <Card
            elevation={2}
            sx={{
                height: "100%",
            }}
        >

            <CardContent>

                <Typography
                    variant="h6"
                    gutterBottom
                    fontWeight={600}
                >
                    Assessment Distribution
                </Typography>

                <ResponsiveContainer
                    width="100%"
                    height={320}
                >

                    <PieChart>

                        <Pie

                            data={analyticsDummyData.distribution}

                            dataKey="value"

                            nameKey="name"

                            cx="50%"

                            cy="50%"

                            outerRadius={100}

                            innerRadius={60}

                            paddingAngle={3}

                        >

                            {

                                analyticsDummyData.distribution.map((entry, index) => (

                                    <Cell
                                        key={entry.name}
                                        fill={COLORS[index]}
                                    />

                                ))

                            }

                        </Pie>

                        <Tooltip />

                        <Legend
                            verticalAlign="bottom"
                            height={36}
                        />

                    </PieChart>

                </ResponsiveContainer>

            </CardContent>

        </Card>

    );

};

export default AssessmentChart;